import { AssetCategory } from "@prisma/client";

import prisma from "../../../prisma/client";
import { CreateAssetCategoryDto } from "./categories.types";
import httpErrors from "../../common/utils/http-error.util";

export const createAssetCategory = async (dto: CreateAssetCategoryDto): Promise<AssetCategory> => {
  const categoryExists = await prisma.assetCategory.findFirst({
    where: { name: dto.name.toLowerCase() },
  });

  if (categoryExists) {
    throw httpErrors.badRequest("Kategoria z taką nazwą już istnieje");
  }

  return await prisma.assetCategory.create({ data: { name: dto.name.toLowerCase() } });
};

export const getAssetCategories = async (): Promise<AssetCategory[]> => {
  return await prisma.assetCategory.findMany({ include: { assets: true } });
};
