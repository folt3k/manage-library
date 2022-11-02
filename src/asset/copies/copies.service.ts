import { AssetCopy, AssetRental } from "@prisma/client";

import prisma from "../../../prisma/client";
import { AssetCopyStatus, CreateAssetCopyDto } from "./copies.types";
import { baseAssetCopyMapper } from "./copies.mapper";
import { BaseAssetCopyRO } from "./copies.models";

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
  const assetCopyStatus = getAssetCopyStatus(assetCopy);
  const canRent = assetCopy.isFreeAccess ? false : true;

  return baseAssetCopyMapper({ ...assetCopy, status: assetCopyStatus, canRent });
};

export const getAssetCopies = async (assetId: string): Promise<BaseAssetCopyRO[]> => {
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
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return data.map((item) =>
    baseAssetCopyMapper({
      ...item,
      status: getAssetCopyStatus(item),
      canRent: canRent(item),
    })
  );
};

export const getAssetCopy = async (copyId: string): Promise<BaseAssetCopyRO> => {
  const data = await prisma.assetCopy.findFirstOrThrow({
    where: {
      id: copyId,
    },
  });

  return baseAssetCopyMapper({
    ...data,
    status: getAssetCopyStatus(data),
    canRent: data.isFreeAccess ? false : true,
  });
};

const getAssetCopyStatus = (copy: AssetCopy): AssetCopyStatus => {
  return AssetCopyStatus.ACTIVE;
};

const canRent = (copy: AssetCopy & { rentals: AssetRental[] }): boolean => {
  if (copy.isFreeAccess) {
    return false;
  }

  if (copy.rentals.find((rental) => !rental.isReturned)) {
    return false;
  }

  return true;
};
