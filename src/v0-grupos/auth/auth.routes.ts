import { Router, Request, Response } from "express";
import { areCredencialesValidas, inicioSesion } from "./auth.services";
import { CredencialesSIIAU, ErrorSIIAU } from "../types";


export const router: Router = Router({mergeParams: true});

router.post("/", (req: Request, res: Response): void => {
  const credenciales: CredencialesSIIAU = req.body;

  if (!areCredencialesValidas(credenciales)) {
    res.status(400).send({
      codigo: 400,
      error: "Las credenciales son inválidas. Inténtalo de nuevo."
    });
    return;
  }

  inicioSesion(credenciales)
  .then( response => {
    if (response.hasOwnProperty("codigo"))
      res.status((response as ErrorSIIAU).codigo).send(response);
    else
      res.send(response);
  })
});
