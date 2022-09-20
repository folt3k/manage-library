import { NextFunction, Request, Router, Response } from "express";

import { createUser, getUsers } from "./user.service";

const router = Router();

router.post("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdUser = await createUser(req.body);

    res.json(createdUser);
  } catch (err) {
    next(err);
  }
});

router.get("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getUsers();

    res.json(users);
  } catch (err) {
    next(err);
  }
});

export default router;
