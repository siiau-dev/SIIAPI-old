import { AxiosResponse } from "axios";

export type ErrorSIIAU = {
  codigo: number;
  error: string;
};

export type RespuestaSIIAU = AxiosResponse | ErrorSIIAU; 

export type CredencialesSIIAU = {
  codigo: string;
  nip: string;
};

export type AlumnoSIIAU = {
  pid: number;
  cookies: Array<string>;
  carreras: Array<string>;
  expiracion: number;
};

export interface RequestBasicoSIIAU {
  pid: number;
  cookies: Array<string>;
  carrera: string;
}

export interface RequestCicloSIIAU extends RequestBasicoSIIAU {
  ciclo: string;
}

export interface MateriaSIIAU {
  clave: string;
  nrc: number;
}

export interface ConsultaMateriaSIIAU extends MateriaSIIAU {
  centro: string;
  ciclo: string;
}


export type DiasSIIAU = "L" | "M" | "I" | "J" | "V" | "S";

export type HorarioMateriaSIIAU = {
  hora: {
    inicio: string;
    final: string;
  };
  dias: Array<DiasSIIAU>;
  salon: {
    edificio: string;
    aula: string;
  };
};

export type SesionMateriaSIIAU = {
  id: number;
  profesor: string;
  horarios: Array<HorarioMateriaSIIAU>;
};

export type MaestroMateriaSIIAU = {
  sesion: number;
  nombre: string;
}

export type InfoMateriaSIIAU = {
  nombre: string;
  seccion: string;
  creditos: number;
  cupo: {
    total: number;
    registrados: number;
  };
  sesiones: Array<SesionMateriaSIIAU>;
};
