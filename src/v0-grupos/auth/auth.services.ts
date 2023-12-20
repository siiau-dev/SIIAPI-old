import { AxiosResponse } from "axios";
import * as jsdom from "jsdom";
import { requestSIIAU, updateExpiration } from "../shared/shared.services";
import { CredencialesSIIAU, AlumnoSIIAU, ErrorSIIAU } from "../shared/shared.types";

export function areCredencialesValidas(credenciales: CredencialesSIIAU): boolean {
  let validas: boolean = true;
  const patronCodigo: RegExp = /^\d{5}$|^\d{7,}$/;
  const patronNip: RegExp = /^[a-zA-Z0-9]{1,10}$/;

  if (!credenciales.codigo) validas = false;
  if (!patronCodigo.test(credenciales.codigo)) validas = false;

  if (!credenciales.nip) validas = false;
  if (!patronNip.test(credenciales.nip)) validas = false;

  return validas;
} 

export async function inicioSesion(credenciales: CredencialesSIIAU): Promise<AlumnoSIIAU | ErrorSIIAU> {
  const alumno = {} as AlumnoSIIAU;


  const payload = {
    "p_codigo_c": credenciales.codigo,
    "p_clave_c": credenciales.nip
  };

  const extPayload = JSON.parse(JSON.stringify(payload));
  for (let i = 1; i <= 4; i++) extPayload["p"+i] = 'a';
  
  const stage_1: AxiosResponse | ErrorSIIAU = await requestSIIAU("https://siiauescolar.siiau.udg.mx/wus/gupprincipal.forma_inicio", "get");
  if (stage_1.hasOwnProperty("codigo")) return stage_1 as ErrorSIIAU;
  
  const stage_2: AxiosResponse | ErrorSIIAU = await requestSIIAU("https://siiauescolar.siiau.udg.mx/wus/gupprincipal.forma_inicio_bd", "post", extPayload);
  if (stage_2.hasOwnProperty("codigo")) return stage_2 as ErrorSIIAU;

  const stage_3: AxiosResponse | ErrorSIIAU = await requestSIIAU("https://siiauescolar.siiau.udg.mx/wus/GUPPRINCIPAL.VALIDA_INICIO", "post", payload);
  if (stage_3.hasOwnProperty("codigo")) return stage_3 as ErrorSIIAU;

  const pidResponseText: string = (stage_3 as AxiosResponse).data;
  const pidParser = new jsdom.JSDOM(pidResponseText);

  const pidElem: Element | null = pidParser.window.document.querySelector("input[name='p_pidm_n']");

  if (pidElem) {
    const pid: string | null = pidElem.getAttribute("value");
    if (pid !== null) {
      alumno.pid = parseInt(pid as string);
      alumno.cookies = (stage_3 as AxiosResponse).headers["set-cookie"]?.map(str => str.replace(";path=/", "")) as Array<string>;
      alumno.expiration = updateExpiration();
      return alumno;
    }
  }

  const inicioSesionInvalido: Element | null = pidParser.window.document.querySelector("script");

  if (inicioSesionInvalido){
    if (inicioSesionInvalido.innerHTML === "alert('Los datos proporcionados no son validos');")
      return {
        codigo: 400,
        error: "Las credenciales son inválidas. Inténtalo de nuevo."
      } as ErrorSIIAU;
    else if (inicioSesionInvalido.innerHTML === 'document.location.replace("gupuweb.bloqueo");')
      return {
        codigo: 503,
        error: "Tu accesso a SIIAU ha sido bloqueado temporalmente. Inténtalo más tarde."
      } as ErrorSIIAU;
  }

  return {
    codigo: 503,
    error: "Hubo un error al autenticar en SIIAU. Inténtalo más tarde."
  } as ErrorSIIAU;

}
