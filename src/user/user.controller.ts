import { UserRole } from "@prisma/client";
import { NextFunction, Request, Router, Response } from "express";
import { auth } from "../auth/auth.middlewares";

import { createUser, getUsers } from "./user.service";

const router = Router();

router.post(
  "/users",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password } = await createUser(req.body);

      res.json({ password });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getUsers();

    res.json(users);
  } catch (err) {
    next(err);
  }
});

export default router;
