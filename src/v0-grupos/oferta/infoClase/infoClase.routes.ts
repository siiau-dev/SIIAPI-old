import { Router, Request, Response } from "express";
import { isClaseValida, getInfoClase } from "./infoClase.services"
import { ConsultaMateriaSIIAU, ErrorSIIAU } from "../../shared/shared.types";

export const router: Router = Router({mergeParams: true});

router.post("/", (req: Request, res: Response): void => {
  const claseInfo: ConsultaMateriaSIIAU = req.body;

  if (!isClaseValida(claseInfo)) {
    res.status(400).send({
      codigo: 400,
      error: "La solicitud es inválida. Inténtalo de nuevo"
    });
    return;
  }

  getInfoClase(claseInfo)
  .then(response => {
    if (response.hasOwnProperty("codigo"))
      res.status((response as ErrorSIIAU).codigo).send(response);
    else
      res.send(response);
  });
});
