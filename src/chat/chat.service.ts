import { ChatMessage, ChatRoom } from "@prisma/client";

import { CreateChatMessageDto } from "./chat.types";
import prisma from "../../prisma/client";
import { CurrentUser } from "../auth/auth.models";
import httpErrors from "../common/utils/http-error.util";

export const getCurrentUserChatRooms = async (currentUser: CurrentUser): Promise<ChatRoom[]> => {
  return await prisma.chatRoom.findMany({
    where: {
      memberIds: {
        has: currentUser.id,
      },
      members: {
        every: {
          disabled: false,
        }
      }

    },
    orderBy: {}
  })
}

export const createChatMessage = async (
  dto: CreateChatMessageDto,
  currentUser: CurrentUser
): Promise<ChatMessage> => {
  if (dto.roomId) {
    return await prisma.chatMessage.create({
      data: {
        content: dto.content,
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        room: {
          connect: {
            id: dto.roomId,
          },
        },
      },
    });
  } else if (dto.receiverId) {
    let room = await prisma.chatRoom.findFirst({
      where: {
        memberIds: {
          hasEvery: [currentUser.id, dto.receiverId],
        },
      },
    });

    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          members: {
            connect: [
              {
                id: currentUser.id,
              },
              {
                id: dto.receiverId,
              },
            ],
          },
        },
      });
    }

    return await prisma.chatMessage.create({
      data: {
        content: dto.content,
        senderId: currentUser.id,
        roomId: room.id,
      },
    });
  }

  throw httpErrors.badRequest();
};
