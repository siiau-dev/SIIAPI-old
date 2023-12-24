import { Router } from "express";

import * as authRoutes from "./auth/auth.routes"
import * as horarioRoutes from "./horario/horario.routes"

export const router: Router = Router();

router.use('/auth', authRoutes.router);
router.use('/horario', horarioRoutes.router);
