import { AssetCategory } from "@prisma/client";

import prisma from "../../../prisma/client";
import { CreateAssetCategoryDto } from "./categories.types";

export const createAssetCategory = async (dto: CreateAssetCategoryDto): Promise<AssetCategory> => {
  return await prisma.assetCategory.create({ data: dto });
};

export const getAssetCategories = async (): Promise<AssetCategory[]> => {
  return await prisma.assetCategory.findMany({ include: { assets: true } });
};
