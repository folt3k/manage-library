import { SlimUser } from "../user/user.models";
import { ChatMessage } from "@prisma/client";

export interface BaseChatRoomRO {
  id: string;
  updatedAt: Date;
  members: SlimUser[];
  messages: Array<Partial<ChatMessage>>;
}
