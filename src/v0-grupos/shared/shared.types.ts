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
  majors: Array<string>;
  expiration: number;
};

export interface RequestBasicoSIIAU {
  pid: number;
  cookies: Array<string>;
  major: string;
}

export interface RequestCicloSIIAU extends RequestBasicoSIIAU {
  ciclo: string;
}

export type MateriaSIIAU = {
  clave: string;
  nrc: number;
};

export type DiasSIIAU = "L" | "M" | "I" | "J" | "V" | "S";

export type HorarioMateriaSIIAU = {
  sesion: number;
  dias: Array<DiasSIIAU>;
  horaInicio: number;
  horaFinal: number;
  edificio: string;
};

export type InfoMateriaSIIAU = {
  nombre: string;
  seccion: string;
  creditos: number;
  horarios: Array<HorarioMateriaSIIAU>;
};
