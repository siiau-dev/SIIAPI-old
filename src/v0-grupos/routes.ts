import { Router } from "express";

import * as alumnoRoutes from "./alumno/alumno.routes"

export const router: Router = Router();

router.use('/alumno', alumnoRoutes.router);
