import { AxiosResponse } from "axios";
const axios = require("axios");
import { ErrorSIIAU } from "./types";

const toUrlEncoded = (obj: any): string => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');

export async function requestSIIAU(url: string, metodo: "get" | "post", data?: any): Promise<AxiosResponse | ErrorSIIAU> {
  let response: AxiosResponse;
  try {
    if (metodo === "get") {
      response = await axios.get(url);
    } else {
      response = await axios.post(url, toUrlEncoded(data));
    }

    if (response.status !== 200) {
      return {codigo: 503, error: "Hubo un error al comunicarse con SIIAU. Inténtalo más tarde."} as ErrorSIIAU;
    }

    return response;
  } catch (_error) {
    return {codigo: 503, error: "Hubo un error al realizar la solicitud. Inténtalo más tarde. " + _error} as ErrorSIIAU;
  }
} 
