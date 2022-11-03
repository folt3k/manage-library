import prisma from "../../../prisma/client";
import { CurrentUser } from "../../auth/auth.models";
import { MAX_RENTAL_PERION_IN_MONTHS } from "../../common/constans";
import httpErrors from "../../common/utils/http-error.util";
import { BaseAssetCopyRO } from "../copies/copies.models";
import { getAssetCopy } from "../copies/copies.service";
import { markAssetReservationAsRent as markUserAssetReservationAsRent } from "../reservations/reservations.service";

export const createAssetRental = async (
  copyId: string,
  currentUser: CurrentUser
): Promise<BaseAssetCopyRO> => {
  const currentDate = new Date();

  const assetCopy = await getAssetCopy(copyId, currentUser);

  if (!assetCopy.canRent) {
    throw httpErrors.badRequest("Nie można wypożyczyć tego egzamplarza");
  }

  await prisma.assetRental.create({
    data: {
      copyId,
      userId: currentUser.id,
      expiredAt: new Date(currentDate.setDate(currentDate.getDate() + MAX_RENTAL_PERION_IN_MONTHS)),
    },
  });

  await markUserAssetReservationAsRent(copyId, currentUser);

  const updatedAssetCopy = await getAssetCopy(copyId, currentUser);

  return updatedAssetCopy;
};
