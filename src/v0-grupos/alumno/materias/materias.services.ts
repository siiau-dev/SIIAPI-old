import { AxiosResponse } from "axios";
import { JSDOM } from "jsdom";
import { EnlacesAlumnoSIIAU } from "../../shared/shared.links";
import { requestSIIAU } from "../../shared/shared.services";
import { RequestCicloSIIAU, MateriaSIIAU, RespuestaSIIAU, ErrorSIIAU } from "../../shared/shared.types";

// Esto debería ir en shared services?
export function isRequestCicloValido(request: RequestCicloSIIAU): boolean {
  let valido: boolean = true;
  const patronPid: RegExp = /^\d{7}$/;
  const patronCarrera: RegExp = /^[A-Z]{3,4}$/;
  const patronCiclo: RegExp = /^(?=(?:\D*\d){4}[^\d]*$)\d{4}[a-zA-Z]$|^\d{6}$/;

  if (!request.pid) valido = false;
  else if (typeof request.pid !== "number" || !patronPid.test(request.pid.toString())) valido = false;

  // No estoy seguro de cómo validar la cookie SIIAUSESSION, ya que en mis pruebas me ha retornado enteros de 8, 9 o 10 dígitos (y posiblemente otra cantidad), por lo que sólo validaré la cookie SIIAUUDG
  if ((!request.cookies) || (!Array.isArray(request.cookies))) valido = false;
  else request.cookies.forEach((cookie, _index, _array) => {
    if (/\b\w*SIIAUUDG\w*\b/.test(cookie))
      if (+cookie.substring(cookie.indexOf("=") + 1) !== request.pid)
        valido = false;
  });

  // Las carreras en CUCEI tienen de 3 a 4 letras mayúsculas como clave, no estoy seguro cómo sea en otros centros pero por la prueba lo validaré así
  if (!request.carrera) valido = false;
  else if (!patronCarrera.test(request.carrera)) valido = false;

  if (!request.ciclo) valido = false;
  else if (!patronCiclo.test(request.ciclo)) valido = false;

  return valido;
}

export async function getListaMaterias(request: RequestCicloSIIAU): Promise<Array<MateriaSIIAU> | ErrorSIIAU> {
  let materias = [] as Array<MateriaSIIAU>;

  const payload = {
    "pidmp": request.pid,
    "ciclop": request.ciclo,
    "majrp": request.carrera
  };

  const respuestaHorario: RespuestaSIIAU = await requestSIIAU(EnlacesAlumnoSIIAU.alumno.getFullMateriasURL(), "post", payload, request.cookies);
  if (respuestaHorario.hasOwnProperty("codigo")) return respuestaHorario as ErrorSIIAU;
  const horarioParser: JSDOM = new JSDOM((respuestaHorario as AxiosResponse).data);
  const tablaHorarioElem: Element | null = horarioParser.window.document.querySelector("table[align='center']");

  if (tablaHorarioElem) {
    for (let i = 2; i < (tablaHorarioElem as HTMLTableElement).rows.length - 1; i+=2) {
      const materia = {} as MateriaSIIAU;
      const materiaFila: HTMLTableRowElement = (tablaHorarioElem as HTMLTableElement).rows[i];

      materia.clave = materiaFila.cells[0].innerHTML;
      materia.nrc = +materiaFila.cells[2].innerHTML;

      materias.push(materia);
    }
    
    // Debido a la manera en la que se muestran las materias en SIIAU podemos tener duplicados
    const claves = materias.map(({clave}) => clave);
    const materiasUnicas = materias.filter(({clave}, index) => !claves.includes(clave, index + 1));

    return materiasUnicas;
  }

  return {
    codigo: 503,
    error: "Hubo un error al conseguir la lista de materias. Inténtalo más tarde."
  } as ErrorSIIAU;
}
