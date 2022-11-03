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

  const assetCopy = await prisma.assetCopy.findFirstOrThrow({
    where: {
      id: copyId,
    },
  });

  if (assetCopy.isFreeAccess) {
    throw httpErrors.badRequest(
      "Nie można zarezerwować tego egzemplarza, ponieważ jest wolny dostęp do niego"
    );
  }

  const isNotReturnedRentalExists = await prisma.assetRental.findFirst({
    where: { copyId: copyId, isReturned: false },
  });

  if (!isNotReturnedRentalExists) {
    throw httpErrors.badRequest(
      "Nie można zarezerwować tego egzemplarza, ponieważ można go wypożyczyć"
    );
  }

  const isActiveReservationForCurrentUserExists = await prisma.assetReservation.findFirst({
    where: {
      userId: currentUser.id,
      expiredAt: {
        gte: new Date(),
      },
    },
  });

  if (isActiveReservationForCurrentUserExists) {
    throw httpErrors.badRequest("Istnieje już aktywna rezerwacja dla tego użytkownika");
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
