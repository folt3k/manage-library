import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from 'dotenv';

import HttpException from "./common/types/http";
import routes from "./routes";
import httpErrors from "./common/utils/http-error.util";

dotenv.config();

const port = process.env.PORT;
const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads/", express.static("uploads"));
app.use(routes);

app.use(() => {
  throw httpErrors.notFound();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error | HttpException, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpException) {
    res.status(err.errorCode).json({ code: err.errorCode, message: err.message });
  } else {
    res.status(500).json({ code: 500, message: err.message || "Wstąpił nieznany błąd" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
