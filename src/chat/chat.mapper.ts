import { ChatMessage, ChatRoom, User } from "@prisma/client";
import { omit } from "lodash";

import { BaseChatRoomRO } from "./chat.models";

export const baseChatRoomMapper = (
  data: ChatRoom & { members: User[]; messages: ChatMessage[] }
): BaseChatRoomRO => ({
  id: data.id,
  updatedAt: data.updatedAt,
  members: data.members.map((m) => ({ id: m.id, firstName: m.firstName, lastName: m.lastName })),
  messages: data.messages.map((m) => omit<ChatMessage>(m, ["roomId"])),
});
