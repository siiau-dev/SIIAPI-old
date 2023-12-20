// Este tipo sólo tiene sentido acá
type Metodo = "http" | "https";

const __contruirUrlCompleta = (enlace: string, metodo?: Metodo, base: string = __baseURLSIIAU): string => (metodo ? metodo : "https") + "://" + base + enlace;

/**
 * Base
 */
const __baseURLSIIAU = "siiauescolar.siiau.udg.mx"; 

export const EnlacesAlumnoSIIAU: any = {
  /**
   * Auth
   */

  authPaso1URL: "/wus/gupprincipal.forma_inicio",
  getFullAuthPaso1URL: function (metodo?: Metodo) { return __contruirUrlCompleta(this.authPaso1URL, metodo)},

  authPaso2URL: "/wus/gupprincipal.forma_inicio_bd",
  getFullAuthPaso2URL: function (metodo?: Metodo) { return __contruirUrlCompleta(this.authPaso2URL, metodo)},

  authPaso3URL: "/wus/GUPPRINCIPAL.VALIDA_INICIO",
  getFullAuthPaso3URL: function (metodo?: Metodo) { return __contruirUrlCompleta(this.authPaso3URL, metodo)},
};
