import prisma from "../../../prisma/client";
import { CurrentUser } from "../../auth/auth.models";
import { MAX_RENTAL_PERION_IN_MONTHS } from "../../common/constans";
import httpErrors from "../../common/utils/http-error.util";
import { BaseAssetCopyRO } from "../copies/copies.models";
import { getAssetCopy } from "../copies/copies.service";
import {
  activateNextAssetReservation as manageAssetReservationsOnRentalClose,
  markAssetReservationAsExpired as markUserAssetReservationAsRent,
} from "../reservations/reservations.service";
import { BaseAssetRentalRO } from "./rentals.models";
import { ListWithPagination, PaginationParams } from "../../common/models/pagination";
import { BaseAssetRO } from "../asset.models";
import { baseAssetMapper } from "../asset.mapper";

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

export const closeAssetRental = async (
  rentalId: string,
  currentUser: CurrentUser
): Promise<BaseAssetRentalRO> => {
  const rental = await prisma.assetRental.findFirstOrThrow({
    where: {
      id: rentalId,
    },
  });

  if (rental.isReturned) {
    throw httpErrors.badRequest("To wypożyczenie zostało już zamknięte");
  }

  await prisma.assetRental.update({
    where: {
      id: rental.id,
    },
    data: {
      isReturned: true,
    },
  });

  await manageAssetReservationsOnRentalClose(rental.copyId, currentUser);

  const updatedAssetRental = await prisma.assetRental.findFirstOrThrow({ where: { id: rentalId } });

  return updatedAssetRental;
};

export const getAssetRentals = async (
  params: PaginationParams
): Promise<ListWithPagination<BaseAssetRentalRO>> => {
  const page = params.page;
  const perPage = params.perPage;

  const data = await prisma.assetRental.findMany({
    orderBy: {
      isReturned: "asc",
    },
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      copy: {
        include: {
          asset: true,
        },
      },
      user: true,
    },
  });
  const total = await prisma.asset.count();

  return {
    page,
    perPage,
    total,
    items: data,
  };
};
