import prisma from "../../../prisma/client";
import { CurrentUser } from "../../auth/auth.models";
import { MAX_RESERVATION_PERION_IN_DAYS } from "../../common/constans";
import httpErrors from "../../common/utils/http-error.util";
import { BaseAssetCopyRO } from "../copies/copies.models";
import { getAssetCopy } from "../copies/copies.service";

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
