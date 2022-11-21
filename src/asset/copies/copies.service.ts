import prisma from "../../../prisma/client";
import { CreateAssetCopyDto } from "./copies.types";
import { baseAssetCopyMapper } from "./copies.mapper";
import { BaseAssetCopyRO } from "./copies.models";
import { CurrentUser } from "../../auth/auth.models";

export const createAssetCopy = async (
  assetId: string,
  dto: CreateAssetCopyDto,
  currentUser: CurrentUser
): Promise<BaseAssetCopyRO> => {
  const assetCopiesCount = await prisma.assetCopy.count();

  const assetCopy = await prisma.assetCopy.create({
    data: {
      isFreeAccess: dto.isFreeAccess,
      assetId: assetId,
      inventoryNumber: `F1 ${assetCopiesCount + 1}`,
    },
  });

  return baseAssetCopyMapper({ ...assetCopy, rentals: [], reservations: [] }, currentUser);
};

export const getAssetCopies = async (
  assetId: string,
  currentUser: CurrentUser
): Promise<BaseAssetCopyRO[]> => {
  const data = await prisma.assetCopy.findMany({
    where: {
      assetId,
      disabled: false,
    },
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
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  ``;
  return data.map((item) => baseAssetCopyMapper(item, currentUser));
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
    },
  });

  return baseAssetCopyMapper(data, currentUser);
};
