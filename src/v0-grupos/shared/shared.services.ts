import { AxiosHeaders, AxiosResponse } from "axios";
// axios parece tener un bug que no me deja hacer requests al importarlo con la versión que estoy utilizando, si corrigen esto en el futuro por favor hagan un pr haciendo los cambios correspondientes y cambiando la versión requerida.
const axios = require("axios");
import { JSDOM } from "jsdom";
import { ErrorSIIAU, RespuestaSIIAU } from "./shared.types";

const toUrlEncoded = (obj: any): string => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');

// Esta función debería regresar el DOM?
export async function requestSIIAU(url: string, metodo: "get" | "post", data?: any, cookies?: Array<string>): Promise<RespuestaSIIAU> {
  let response: AxiosResponse;

  try {
    response = await axios({
      url: url,
      method: metodo,
      transformRequest: [(data: any, _headers: AxiosHeaders): string => typeof data === "string" ? data : toUrlEncoded(data)],
      headers: {
        'Cookie': cookies ? cookies.join("; ") : ""
      },
      data: data ? data : "",
      withCredentials: true
    });
  } catch (error) {
    console.log("Error al mandar solicitud. " + error);
    return {
      codigo: 503,
      error: "Hubo un error al realizar la solicitud. Inténtalo más tarde."
    } as ErrorSIIAU;
  }

  if (response.status !== 200) {
    return {
      codigo: 503,
      error: "Hubo un error al comunicarse con SIIAU. Inténtalo más tarde."
    } as ErrorSIIAU;
  }

  const isExpiredParser: JSDOM = new JSDOM(response.data);
  const isExpiredElem: NodeListOf<Element> | null = isExpiredParser.window.document.querySelectorAll("script");
  
  // Si alguien tiene una mejor idea de cómo hacer esto por favor mande pr
  if (isExpiredElem && (isExpiredElem as NodeListOf<Element>).length > 1 && (isExpiredElem as NodeListOf<Element>)[1].innerHTML.replace(/[\r\n\s]+/g, "") == "alert(\"SESIONINVALIDAOTERMINADAPORINACTIVIDAD\");window.parent.parent.location.href=\"gupprincipal.salir\";") return {
    codigo: 422,
    error: "La sesión ha expirado. Vuelve a iniciar sesión."
  } as ErrorSIIAU;

  return response;
} 

const ExpirationTimeSIIAU: number = 0;
export const updateExpiration = (): number => Date.now() + ExpirationTimeSIIAU;
