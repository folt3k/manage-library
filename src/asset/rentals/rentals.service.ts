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
import { BaseListAssetRentalRO, ListAssetRentalRO } from "./rentals.models";
import { ListWithPagination, PaginationParams } from "../../common/types/pagination";
import { baseListAssetRental, listAssetRental } from "./rentals.mapper";
import { SortParams } from "../../common/types/sort";
import { prepareOrderBy } from "../../common/utils/sort.utils";

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

  return await getAssetCopy(copyId, currentUser);
};

export const closeAssetRental = async (
  rentalId: string,
  currentUser: CurrentUser
): Promise<ListAssetRentalRO> => {
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
      returnedAt: new Date(),
    },
  });

  await manageAssetReservationsOnRentalClose(rental.copyId, currentUser);

  const updatedAssetRental = await prisma.assetRental.findFirstOrThrow({
    where: { id: rentalId },
    include: {
      copy: {
        include: {
          asset: {
            include: {
              author: true,
            },
          },
        },
      },
      user: true,
    },
  });

  return listAssetRental(updatedAssetRental);
};

export const getAssetRentals = async (
  params: PaginationParams & SortParams & {}
): Promise<ListWithPagination<ListAssetRentalRO>> => {
  const page = params.page;
  const perPage = params.perPage;

  const orderBy = prepareOrderBy(
    params,
    ({ sortBy, sortOrder }) => {
      switch (sortBy) {
        case "inventoryNumber":
          return {
            copy: {
              inventoryNumber: sortOrder,
            },
          };
        case "author":
          return {
            copy: {
              asset: {
                author: {
                  lastName: sortOrder,
                },
              },
            },
          };
        case "user":
          return {
            user: {
              lastName: sortOrder,
            },
          };
        case "createdAt":
          return {
            createdAt: sortOrder,
          };
        case "expiredAt":
          return {
            expiredAt: sortOrder,
          };
        case "returnedAt":
          return {
            returnedAt: sortOrder,
          };
        case "isReturned":
          return {
            isReturned: sortOrder,
          };
      }
    },
    {
      isReturned: "asc",
    }
  );

  const data = await prisma.assetRental.findMany({
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      copy: {
        include: {
          asset: {
            include: {
              author: true,
            },
          },
        },
      },
      user: true,
    },
  });
  const total = await prisma.assetRental.count();

  return {
    page,
    perPage,
    total,
    items: data.map((item) => listAssetRental(item)),
  };
};

export const getAssetRentalsByUserId = async (
  userId: string,
  params: PaginationParams
): Promise<ListWithPagination<BaseListAssetRentalRO>> => {
  const page = params.page;
  const perPage = params.perPage;

  const data = await prisma.assetRental.findMany({
    where: {
      userId,
    },
    orderBy: {
      isReturned: "asc",
    },
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      copy: {
        include: {
          asset: {
            include: {
              author: true,
            },
          },
        },
      },
    },
  });
  const total = await prisma.assetRental.count({ where: { userId } });

  return {
    page,
    perPage,
    total,
    items: data.map((item) => baseListAssetRental(item)),
  };
};
