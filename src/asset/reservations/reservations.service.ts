import { AssetReservation } from "@prisma/client";

import prisma from "../../../prisma/client";
import { CurrentUser } from "../../auth/auth.models";
import { MAX_RESERVATION_PERION_IN_DAYS } from "../../common/constans";
import httpErrors from "../../common/utils/http-error.util";
import { BaseAssetCopyRO } from "../copies/copies.models";
import { getAssetCopy } from "../copies/copies.service";
import { ListWithPagination, PaginationParams } from "../../common/models/pagination";
import { listUserAssetReservation } from "./reservations.mapper";

export const createAssetReservation = async (
  copyId: string,
  currentUser: CurrentUser
): Promise<BaseAssetCopyRO> => {
  const assetCopy = await getAssetCopy(copyId, currentUser);

  if (!assetCopy.canReserve) {
    throw httpErrors.badRequest("Nie można zarezerwować tego egzemplarza");
  }

  await prisma.assetReservation.create({
    data: {
      copyId,
      userId: currentUser.id,
    },
  });

  const updatedAssetCopy = await getAssetCopy(copyId, currentUser);

  return updatedAssetCopy;
};

export const markAssetReservationAsExpired = async (
  copyId: string,
  user: CurrentUser
): Promise<void> => {
  const reservations = await prisma.assetReservation.findMany({
    where: {
      copyId,
      userId: user.id,
      isExpired: false,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 1,
  });

  if (reservations.length) {
    await prisma.assetReservation.update({
      where: {
        id: reservations[0].id,
      },
      data: {
        isExpired: true,
      },
    });
  }
};

export const activateNextAssetReservation = async (
  copyId: string,
  user: CurrentUser
): Promise<void> => {
  const reservations = await prisma.assetReservation.findMany({
    where: {
      copyId,
      userId: user.id,
      isExpired: false,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 2,
  });

  if (reservations.length) {
    const [currentReservation, nextReservation] = reservations;
    await prisma.assetReservation.update({
      where: {
        id: currentReservation.id,
      },
      data: {
        isExpired: true,
      },
    });

    if (nextReservation) {
      const currentDate = new Date();
      currentDate.setHours(23, 59, 59, 999);

      await prisma.assetReservation.update({
        where: {
          id: nextReservation.id,
        },
        data: {
          expiredAt: new Date(
            currentDate.setDate(currentDate.getDate() + MAX_RESERVATION_PERION_IN_DAYS)
          ),
        },
      });
    }
  }
};

export const getAssetReservationsByUserId = async (
  currentUser: CurrentUser,
  params: PaginationParams
): Promise<ListWithPagination<AssetReservation>> => {
  const page = params.page;
  const perPage = params.perPage;

  const data = await prisma.assetReservation.findMany({
    where: {
      userId: currentUser.id,
      isExpired: false,
    },
    orderBy: {
      expiredAt: "desc",
    },
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      copy: {
        include: {
          rentals: {
            where: {
              isReturned: false,
            },
            take: 1,
          },
          reservations: {
            where: {
              isExpired: false,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          asset: {
            include: {
              author: true,
            },
          },
        },
      },
    },
  });
  const total = await prisma.assetReservation.count({
    where: { userId: currentUser.id, isExpired: false },
  });

  return {
    page,
    perPage,
    total,
    items: data.map((item) => listUserAssetReservation(item, currentUser)),
  };
};
