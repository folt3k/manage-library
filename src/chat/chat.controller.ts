import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../auth/auth.middlewares";
import {
  createChatMessage,
  getChatRoomMessages,
  getCurrentUserChatRooms,
  getCurrentUserUnreadMessagesCount,
  markMessagesAsReadOut,
} from "./chat.service";

const router = Router();

router.get(
  "/chat/rooms/:roomId/messages",
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

router.post("/chat/message", auth(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await createChatMessage(req.body, req.user);

    res.json(message);
  } catch (err) {
    next(err);
  }
});

router.get("/chat/rooms", auth(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await getCurrentUserChatRooms(req.user);

    res.json(rooms);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/chat/rooms/:roomId/mark-as-read",
  auth(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await markMessagesAsReadOut(req.params.roomId, req.user);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/chat/unread-messages-count",
  auth(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getCurrentUserUnreadMessagesCount(req.user);

      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
