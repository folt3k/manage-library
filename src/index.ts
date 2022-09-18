import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

app.listen(8000, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:8000}`);
});
