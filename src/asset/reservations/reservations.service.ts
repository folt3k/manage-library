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
  const currentDate = new Date();

  const assetCopy = await getAssetCopy(copyId, currentUser);

  if (!assetCopy.canReserve) {
    throw httpErrors.badRequest("Nie można zarezerwować tego egzemplarza");
  }

  await prisma.assetReservation.create({
    data: {
      copyId,
      userId: currentUser.id,
      expiredAt: new Date(
        currentDate.setDate(currentDate.getDate() + MAX_RESERVATION_PERION_IN_DAYS)
      ),
    },
  });

  const updatedAssetCopy = await getAssetCopy(copyId, currentUser);

  return updatedAssetCopy;
};

export const markAssetReservationAsRent = async (
  copyId: string,
  user: CurrentUser
): Promise<void> => {
  const reservation = await prisma.assetReservation.findFirst({
    where: {
      copyId,
      userId: user.id,
      wasRent: false,
      expiredAt: {
        gte: new Date(),
      },
    },
  });

  if (reservation) {
    await prisma.assetReservation.update({
      where: {
        id: reservation.id,
      },
      data: {
        wasRent: true,
      },
    });
  }
};
