import { UserRole } from "@prisma/client";
import { NextFunction, Request, Router, Response } from "express";

import { auth } from "../auth/auth.middlewares";
import { getPaginationParamsFromQuery } from "../common/utils/pagination.utils";
import { changePassword, createUser, getMe, getReaders, getUser, updateUser } from "./user.service";

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

router.put(
  "/users/:userId",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateUser(req.params.userId, req.body);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/users/change-password",
  auth(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await changePassword(req.body, req.user);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/users/:userId",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getUser(req.params.userId);

      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/users/me", auth(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const me = await getMe(req.user);

    res.json(me);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/users/readers",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = getPaginationParamsFromQuery(req.query);
      const users = await getReaders(params);

      res.json(users);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
