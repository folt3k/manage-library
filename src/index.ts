import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const port = 8000;
const app: Express = express();

async function main() {
  await prisma.$connect();

  app.get("/users", async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();

    res.json(users);
  });

  app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
  });
}

main();
