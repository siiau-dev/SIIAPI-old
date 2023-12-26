/*
 * MIT License
 *
 * Copyright (c) 2023 Lord Friky
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const siiapi_version: string = (process.env.npm_package_version ? process.env.npm_package_version : "???");
console.log("Iniciando SIIAPI " + siiapi_version + "...");
console.log("Para más información visita https://github.com/lordfriky/SIIAPI\n");

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import * as v0gruposRoutes from "./v0-grupos/routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());

// Debido a que este primer release está destinado a ser utilizado sólo para la aplicación de los grupos, CORS es incluído. No es la mejor manera para prevenir que las personas usen esta API, pero quizás podrá ser suficiente para que algunos sepan que no deberían usarla aún.
app.use(cors({
  origin: !process.env.DISABLE_CORS || ["https://grupos.lordfriky.dev"] // Todo: definir url final
}));

app.use("/v0-grupos", v0gruposRoutes.router);

app.get("/", (_req: Request, res: Response) => {
  res.sendFile("views/index.html", {root: __dirname});
});

app.listen(port, () => {
  console.log(`[server]: Server corriendo en puerto ${port}`);
});
