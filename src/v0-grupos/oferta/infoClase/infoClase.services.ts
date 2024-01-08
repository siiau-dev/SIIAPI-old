import { AxiosResponse } from "axios";
import { JSDOM } from "jsdom";
import { EnlacesAlumnoSIIAU } from "../../shared/shared.links";
import { requestSIIAU } from "../../shared/shared.services";
import { ConsultaMateriaSIIAU, InfoMateriaSIIAU, RespuestaSIIAU, ErrorSIIAU, SesionMateriaSIIAU, HorarioMateriaSIIAU, DiasSIIAU } from "../../shared/shared.types";

export function isClaseValida(clase: ConsultaMateriaSIIAU): boolean {
  let valida = true;
  // Quizás sea bueno moverlos a shared
  const patronClave: RegExp = /^[A-Z0-9]{5}$/;
  const patronNrc: RegExp = /^[0-9]{5,6}$/;
  const patronCentro: RegExp = /^[A-Z3]{1}$/;
  const patronCiclo: RegExp = /^(?=(?:\D*\d){4}[^\d]*$)\d{4}[a-zA-Z]$|^\d{6}$/;

  if (!clase.clave) valida = false;
  else if (!patronClave.test(clase.clave)) valida = false;

  if (!clase.nrc) valida = false;
  else if (typeof clase.nrc !== "number" || !patronNrc.test(clase.nrc.toString())) valida = false;

  if (!clase.centro) valida = false;
  else if (!patronCentro.test(clase.centro)) valida = false;

  if (!clase.ciclo) valida = false;
  else if (!patronCiclo.test(clase.ciclo)) valida = false;

  return valida;
}

export async function getInfoClase(clase: ConsultaMateriaSIIAU): Promise<InfoMateriaSIIAU | ErrorSIIAU> {
  const infoClase = {} as InfoMateriaSIIAU;

  const payload = {
    "ciclop": clase.ciclo,
    "cup": clase.centro,
    "crsep": clase.clave,
    "mostrarp": 99999999999999
  };

  let respuestaConsulta: RespuestaSIIAU;
  respuestaConsulta = await requestSIIAU(EnlacesAlumnoSIIAU.oferta.getFullConsultaURL(), "post", payload);
  if (respuestaConsulta.hasOwnProperty("codigo")){
    if ((respuestaConsulta as ErrorSIIAU).error.includes("SIIAU parece estar caído"))
      respuestaConsulta = await requestSIIAU(EnlacesAlumnoSIIAU.oferta.getFullConsultaFallbackURL(), "post", payload);

    if (respuestaConsulta.hasOwnProperty("codigo"))
      return respuestaConsulta as ErrorSIIAU;
  }

  const parser: JSDOM = new JSDOM((respuestaConsulta as AxiosResponse).data);
  const tablaConsulta: Element | null = parser.window.document.querySelector("table");

  if (tablaConsulta) {
    let claseEncontrada: boolean = false;
    if ((tablaConsulta as HTMLTableElement).rows.length === 2)
      return {
        codigo: 422,
        error: "No se encontraron clases con esta clave."
      } as ErrorSIIAU;

    for (let i = 2; i < (tablaConsulta as HTMLTableElement).rows.length; i++) {
      const materiaFila: HTMLTableRowElement = (tablaConsulta as HTMLTableElement).rows[i];
      if (+materiaFila.cells[0].innerHTML !== clase.nrc) continue;
      claseEncontrada = true;
      
      infoClase.nombre = (materiaFila.cells[2].querySelector("a") as Element).innerHTML;
      infoClase.seccion = materiaFila.cells[3].innerHTML;
      infoClase.creditos = materiaFila.cells[4].innerHTML ? +materiaFila.cells[4].innerHTML : -1;
      infoClase.cupo = {} as any; // Todo
      infoClase.cupo.total = materiaFila.cells[5].innerHTML ? +materiaFila.cells[5].innerHTML : -1;
      infoClase.cupo.registrados = materiaFila.cells[6].innerHTML ? infoClase.cupo.total - +materiaFila.cells[6].innerHTML : -1;
      
      // Voy a asumir que todas las sesiones van a tener profesor, o si no lo tienen no mostraré su horario.
      // Idealmente también debería mostrar las sesiones sin profesor, pero no puedo pensar ahorita en una manera eficiente de hacerlo.
      // Worst case scenario podría repetir ciclos, de todos modos no son muchos datos.
      const sesionesTabla = materiaFila.cells[8].querySelector("table") as HTMLTableElement;
      infoClase.sesiones = [];
      for (let j = 0; j < sesionesTabla.rows.length; j++) {
        const sesion = {} as SesionMateriaSIIAU;
        sesion.id = +sesionesTabla.rows[j].cells[0].innerHTML;
        sesion.profesor = sesionesTabla.rows[j].cells[1].innerHTML;
        sesion.horarios = [];

        const horariosTabla = materiaFila.cells[7].querySelector("table") as HTMLTableElement;
        for (let k = 0; k < horariosTabla.rows.length; k++) {
          const horarioFila = horariosTabla.rows[k]
          if (+horarioFila.cells[0].innerHTML !== sesion.id) continue;

          const horario = {} as HorarioMateriaSIIAU;
          
          horario.hora = {} as any; // Todo
          if (horarioFila.cells[1].innerHTML.length !== 0) {
            horario.hora.inicio = horarioFila.cells[1].innerHTML.substr(0, 4);
            horario.hora.final = horarioFila.cells[1].innerHTML.substr(5);
          } else {
            horario.hora.inicio = "";
            horario.hora.final = "";
          }

          horario.dias = [];
          if (horarioFila.cells[2].innerHTML) {
            const diasArray = horarioFila.cells[2].innerHTML.split(" ");
            for (let l = 0; l < 6; l++)
              if (diasArray[l] !== ".")
                horario.dias.push(diasArray[l] as DiasSIIAU);
          }

          horario.salon = {} as any; // Todo
          horario.salon.edificio = horarioFila.cells[3].innerHTML;
          horario.salon.aula = horarioFila.cells[4].innerHTML;
          
          sesion.horarios.push(horario);
        }
        
        infoClase.sesiones.push(sesion);
      }

    }

    if (claseEncontrada)
      return infoClase;
    else
      return {
        codigo: 422,
        error: `No se encontró la clase con el NRC ${clase.nrc.toString()}.`
      } as ErrorSIIAU;
  }
  
  return {
    codigo: 503,
    error: "Hubo un error al conseguir la información de la clase. Inténtalo más tarde."
  } as ErrorSIIAU;
}
