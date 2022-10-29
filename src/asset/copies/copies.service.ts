import { AssetCopy } from "@prisma/client";

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

  return baseAssetCopyMapper({ ...assetCopy, status: assetCopyStatus });
};

export const getAssetCopies = async (assetId: string): Promise<BaseAssetCopyRO[]> => {
  const data = await prisma.assetCopy.findMany({
    where: {
      assetId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return data.map((item) => baseAssetCopyMapper({ ...item, status: getAssetCopyStatus(item) }));
};

const getAssetCopyStatus = (copy: AssetCopy): AssetCopyStatus => {
  return AssetCopyStatus.ACTIVE;
};
