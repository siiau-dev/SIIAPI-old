import { AxiosHeaders, AxiosResponse } from "axios";
const axios = require("axios").default;
import { JSDOM } from "jsdom";
import { ErrorSIIAU, RespuestaSIIAU } from "./shared.types";

const toUrlEncoded = (obj: any): string => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');

export async function requestSIIAU(url: string, metodo: "get" | "post", data?: any, cookies?: Array<string>): Promise<RespuestaSIIAU> {
  let response: AxiosResponse;
  try {
    response = await axios({
      url: url,
      method: metodo,
      transformRequest: [(data: any, _headers: AxiosHeaders): string => typeof data === "string" ? data : toUrlEncoded(data)],
      headers: {
        'Cookie': cookies ? cookies.join(";") : ""
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
  const isExpiredElem: Element | null = isExpiredParser.window.document.querySelector("script");
  if (isExpiredElem && isExpiredElem.innerHTML.trim() === 'if (window.name == "") {location.href="gspsweb.error"}') return {
    codigo: 422,
    error: "La sesión ha expirado. Vuelve a iniciar sesión."
  } as ErrorSIIAU;


  return response;
} 

const ExpirationTimeSIIAU: number = 0;
export const updateExpiration = (): number => Date.now() + ExpirationTimeSIIAU;
