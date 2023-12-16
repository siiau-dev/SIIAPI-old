import { Router } from "express";
import * as authRoutes from "./auth/auth.routes"

export const router: Router = Router();

router.use('/auth', authRoutes.router);
