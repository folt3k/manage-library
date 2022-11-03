import { AssetCopy, AssetRental, AssetReservation, UserRole } from "@prisma/client";

import prisma from "../../../prisma/client";
import { CreateAssetCopyDto } from "./copies.types";
import { baseAssetCopyMapper, listAssetCopyMapper } from "./copies.mapper";
import { BaseAssetCopyRO, ListAssetCopyRO } from "./copies.models";
import { CurrentUser } from "../../auth/auth.models";

export const createAssetCopy = async (
  assetId: string,
  dto: CreateAssetCopyDto
): Promise<BaseAssetCopyRO> => {
  const assetCopiesCount = await prisma.assetCopy.count();

  const assetCopy = await prisma.assetCopy.create({
    data: {
      isFreeAccess: dto.isFreeAccess,
      assetId: assetId,
      inventoryNumber: `F1 ${assetCopiesCount + 1}`,
    },
  });
  const canRent = assetCopy.isFreeAccess ? false : true;
  const canReserve = false;

  return baseAssetCopyMapper({
    ...assetCopy,
    canRent,
    canReserve,
    isRent: false,
    isReserved: false,
  });
};

export const getAssetCopies = async (
  assetId: string,
  currentUser: CurrentUser
): Promise<ListAssetCopyRO[]> => {
  const data = await prisma.assetCopy.findMany({
    where: {
      assetId,
    },
    include: {
      rentals: {
        where: {
          isReturned: false,
        },
      },
      reservations: {
        where: {
          wasRent: false,
          expiredAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  ``;
  return data.map((item) =>
    listAssetCopyMapper({
      ...item,
      canRent: canRent(item, currentUser),
      canReserve: canReserve(item, currentUser),
      activeReservationsCount: item.reservations.length,
      isRent: isRent(item),
      isReserved: isReserved(item),
    })
  );
};

export const getAssetCopy = async (
  copyId: string,
  currentUser: CurrentUser
): Promise<BaseAssetCopyRO> => {
  const data = await prisma.assetCopy.findFirstOrThrow({
    where: {
      id: copyId,
    },
    include: {
      rentals: {
        where: {
          isReturned: false,
        },
      },
      reservations: {
        where: {
          wasRent: false,
          expiredAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return baseAssetCopyMapper({
    ...data,
    canRent: canRent(data, currentUser),
    canReserve: canReserve(data, currentUser),
    isRent: isRent(data),
    isReserved: isReserved(data),
  });
};

const canRent = (
  copy: AssetCopy & { rentals: AssetRental[]; reservations: AssetReservation[] },
  currentUser: CurrentUser
): boolean => {
  if (copy.isFreeAccess) {
    return false;
  }

  if (currentUser.role === UserRole.LIBRARIAN) {
    return false;
  }

  if (copy.rentals.length) {
    return false;
  }

  if (copy.reservations.length) {
    if (copy.reservations[0].userId !== currentUser.id) {
      return false;
    }
  }

  return true;
};

const canReserve = (
  copy: AssetCopy & { rentals: AssetRental[]; reservations: AssetReservation[] },
  currentUser: CurrentUser
): boolean => {
  if (copy.isFreeAccess) {
    return false;
  }

  if (currentUser.role === UserRole.LIBRARIAN) {
    return false;
  }

  if (copy.reservations.length) {
    if (copy.reservations.find((r) => r.userId === currentUser.id)) {
      return false;
    }
  }

  if (!copy.rentals.length) {
    return false;
  }

  return true;
};

const isRent = (copy: AssetCopy & { rentals: AssetRental[] }): boolean => {
  return !!copy.rentals.length;
};

const isReserved = (copy: AssetCopy & { reservations: AssetReservation[] }): boolean => {
  return !!copy.reservations.length;
};
