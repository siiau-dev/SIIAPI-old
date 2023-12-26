import { Router } from "express";

import * as alumnoRoutes from "./alumno/alumno.routes"
import * as ofertaRoutes from "./oferta/oferta.routes"

export const router: Router = Router();

router.use('/alumno', alumnoRoutes.router);
router.use('/oferta', ofertaRoutes.router);
