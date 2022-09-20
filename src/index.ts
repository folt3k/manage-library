import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import HttpException from "./common/models/http";
import prisma from "../prisma/client";
import httpErrors from "./common/utils/http-error.util";
import routes from "./routes";

const port = 8000;
const app: Express = express();

app.use(bodyParser.json());

app.use(routes);

app.get("*", () => {
  throw new HttpException(404, "Nie znaleziono takiego zasobu.");
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error | HttpException, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpException) {
    res.status(err.errorCode).json({ message: err.message });
  } else if (err) {
    res.status(500).json({ message: err.message || "Wstąpił nieznany błąd" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
