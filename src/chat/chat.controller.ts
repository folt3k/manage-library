import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../auth/auth.middlewares";
import { createChatMessage, getChatRoomMessages, getCurrentUserChatRooms } from "./chat.service";

const router = Router();

router.get(
  "/chat-rooms/:roomId/messages",
  auth(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await getChatRoomMessages(req.params.roomId, req.user);

      res.json(messages);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/chat-message", auth(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await createChatMessage(req.body, req.user);

    res.json(message);
  } catch (err) {
    next(err);
  }
});

router.get("/chat-rooms", auth(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await getCurrentUserChatRooms(req.user);

    res.json(rooms);
  } catch (err) {
    next(err);
  }
});

export default router;
