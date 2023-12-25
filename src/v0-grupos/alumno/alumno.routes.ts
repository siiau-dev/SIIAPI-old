import { Router } from "express";

import * as authRoutes from "./auth/auth.routes"
import * as materiasRoutes from "./materias/materias.routes"

export const router: Router = Router({mergeParams: true});

router.use('/auth', authRoutes.router);
router.use('/materias', materiasRoutes.router);
