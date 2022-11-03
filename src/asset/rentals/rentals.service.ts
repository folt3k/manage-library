import { AssetRental } from "@prisma/client";

import prisma from "../../../prisma/client";
import { CurrentUser } from "../../auth/auth.models";
import { MAX_RENTAL_PERION_IN_MONTHS } from "../../common/constans";
import httpErrors from "../../common/utils/http-error.util";
import { BaseAssetCopyRO } from "../copies/copies.models";
import { getAssetCopy } from "../copies/copies.service";

export const createAssetRental = async (
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
      "Nie można wypożyczyć tego egzemplarza, ponieważ jest wolny dostęp do niego"
    );
  }

  const isNotReturnedRentalExists = await prisma.assetRental.findFirst({
    where: { isReturned: false, copyId: copyId },
  });

  if (isNotReturnedRentalExists) {
    // TODO: Tutaj tez ma byc sprawdzanie czy nie ma rezerwacji lub czy jesli sa, to pierwsza jest usera
    throw httpErrors.badRequest("Ten egzamplarz nie został jeszcze zwrócony");
  }

  await prisma.assetRental.create({
    data: {
      copyId,
      userId: currentUser.id,
      expiredAt: new Date(currentDate.setDate(currentDate.getDate() + MAX_RENTAL_PERION_IN_MONTHS)),
    },
  });

  const updatedAssetCopy = await getAssetCopy(copyId, currentUser);

  return updatedAssetCopy;
};
