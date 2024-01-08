// Este tipo sólo tiene sentido acá
type Metodo = "http" | "https";

const __contruirUrlCompleta = (enlace: string, metodo?: Metodo, base: string = __baseURLSIIAU): string => (metodo ? metodo : "https") + "://" + base + enlace;

/**
 * Base
 */
const __baseURLSIIAU = "siiauescolar.siiau.udg.mx"; 

export const EnlacesAlumnoSIIAU: any = {
  ////////////
  // Alumno //
  ////////////

  alumno: {

    /**
    * Auth
    */

    authPaso1URL: "/wus/gupprincipal.forma_inicio",
    getFullAuthPaso1URL: function (metodo?: Metodo) { return __contruirUrlCompleta(this.authPaso1URL, metodo)},

    authPaso2URL: "/wus/gupprincipal.forma_inicio_bd",
    getFullAuthPaso2URL: function (metodo?: Metodo) { return __contruirUrlCompleta(this.authPaso2URL, metodo)},

    authPaso3URL: "/wus/GUPPRINCIPAL.VALIDA_INICIO",
    getFullAuthPaso3URL: function (metodo?: Metodo) { return __contruirUrlCompleta(this.authPaso3URL, metodo)},

    authCarrerasURL: "/wal/gupmenug.menu",
    getFullAuthCarrerasURL: function (metodo?: Metodo) { return __contruirUrlCompleta(this.authCarrerasURL, metodo)},

    /**
    * Materias
    */

    materiasURL: "/wal/sfpcoal.horario",
    getFullMateriasURL: function (metodo?: Metodo) { return __contruirUrlCompleta(this.materiasURL, metodo)},
  },

  //////////////////////
  // Oferta académica //
  //////////////////////

  oferta: {

    /**
     * Consulta
     */

    consultaURL: "/wal/sspseca.consulta_oferta",
    getFullConsultaURL: function (metodo?: Metodo) { return __contruirUrlCompleta(this.consultaURL, metodo)},
    
    // Actualmente esta URL sólo funciona sobre HTTP
    __fallbackBase: "consulta.siiau.udg.mx",

    consultaFallbackURL: "/wco/sspseca.consulta_oferta",
    getFullConsultaFallbackURL: function (metodo?: Metodo) { return __contruirUrlCompleta(this.consultaFallbackURL, metodo ? metodo : "http", this.__fallbackBase)},
  }
};
