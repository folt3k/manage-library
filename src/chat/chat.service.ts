import { ChatMessage, ChatRoom } from "@prisma/client";

import { CreateChatMessageDto } from "./chat.types";
import prisma from "../../prisma/client";
import { CurrentUser } from "../auth/auth.models";
import httpErrors from "../common/utils/http-error.util";
import { baseChatRoomMapper } from "./chat.mapper";
import { BaseChatRoomRO } from "./chat.models";

export const getChatRoomMessages = async (
  roomId: string,
  currentUser: CurrentUser
): Promise<ChatMessage[]> => {
  await prisma.chatRoom.findFirstOrThrow({
    where: {
      id: roomId,
      memberIds: {
        has: currentUser.id,
      },
    },
  });

  return await prisma.chatMessage.findMany({ where: { roomId } });
};

export const getCurrentUserChatRooms = async (
  currentUser: CurrentUser
): Promise<BaseChatRoomRO[]> => {
  const rooms = await prisma.chatRoom.findMany({
    where: {
      memberIds: {
        has: currentUser.id,
      },
      members: {
        every: {
          disabled: false,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      members: true,
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  return rooms.map((r) => baseChatRoomMapper(r));
};

export const createChatMessage = async (
  dto: CreateChatMessageDto,
  currentUser: CurrentUser
): Promise<ChatMessage> => {
  if (dto.roomId) {
    const message = await prisma.chatMessage.create({
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

    await prisma.chatRoom.update({
      where: { id: dto.roomId },
      data: { updatedAt: new Date().toISOString() },
    });

    return message;
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
      include: {
        room: {
          include: {
            members: true,
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });
  }

  throw httpErrors.badRequest();
};
