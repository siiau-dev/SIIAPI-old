import {Router} from "express"

import * as infoClaseRoutes from "./infoClase/infoClase.routes"

export const router: Router = Router({mergeParams: true});

router.use('/infoClase', infoClaseRoutes.router);
