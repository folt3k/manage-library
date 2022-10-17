import { Asset } from "@prisma/client";

import prisma from "../../prisma/client";
import { CreateAssetDto } from "./asset.types";

export const createAsset = async (dto: CreateAssetDto): Promise<Asset> => {
  const asset = await prisma.asset.create({
    data: {
      ...dto,
      categories: {
        connect: dto.categoryIds.map((category) => ({ id: category })),
      },
    },
  });

  return asset;
};

export const getAssets = async (): Promise<Asset[]> => {
  const assets = await prisma.asset.findMany({ include: { categories: true, author: true } });

  return assets;
};
