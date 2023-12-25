import { Router, Request, Response } from "express";
import { isRequestCicloValido, getListaMaterias } from "./materias.services";
import { RequestCicloSIIAU, ErrorSIIAU } from "../../shared/shared.types"; 

export const router: Router = Router({mergeParams: true});

router.post("/", (req: Request, res: Response): void => {
  const requestBody: RequestCicloSIIAU = req.body;

  if (!isRequestCicloValido(requestBody)) {
    res.status(400).send({
      codigo: 400,
      error: "La solicitud es inválida. Inténtalo de nuevo"
    });
    return;
  }

  getListaMaterias(requestBody)
  .then(response => {
    if (!Array.isArray(response))
      res.status((response as ErrorSIIAU).codigo).send(response);
    else
      res.send(response);
  });
});
