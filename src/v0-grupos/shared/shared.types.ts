export type ErrorSIIAU = {
  codigo: number;
  error: string;
};

export type CredencialesSIIAU = {
  codigo: string;
  nip: string;
};

export type AlumnoSIIAU = {
  pid: number;
  cookies: Array<string>;
  expiration: number;
};

//type MateriaSIIAU = {};

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
