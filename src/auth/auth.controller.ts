import { Router, Request, Response, NextFunction } from "express";

import { logIn } from "./auth.service";

const router = Router();

router.post("/auth/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await logIn(req.body);

    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
