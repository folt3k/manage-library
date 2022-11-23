import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../auth/auth.middlewares";
import { createChatMessage } from "./chat.service";

const router = Router();

router.post("/chat-message", auth(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await createChatMessage(req.body, req.user);

    res.json(message);
  } catch (err) {
    next(err);
  }
});

export default router;
