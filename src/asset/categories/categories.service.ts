import { AssetCategory } from "@prisma/client";

import prisma from "../../../prisma/client";
import { CreateAssetCategoryDto } from "./categories.types";
import httpErrors from "../../common/utils/http-error.util";
import { ListWithPagination, PaginationParams } from "../../common/models/pagination";
import { ListAssetCategoryRO } from "./categories.models";
import { listAssetCategoryMapper } from "./categories.mapper";

export const createAssetCategory = async (dto: CreateAssetCategoryDto): Promise<AssetCategory> => {
  const categoryExists = await prisma.assetCategory.findFirst({
    where: { name: dto.name.toLowerCase() },
  });

  if (categoryExists) {
    throw httpErrors.badRequest("Kategoria z taką nazwą już istnieje");
  }

  return await prisma.assetCategory.create({ data: { name: dto.name.toLowerCase() } });
};

export const getAssetCategories = async (
  params: PaginationParams
): Promise<ListWithPagination<ListAssetCategoryRO>> => {
  const page = params.page;
  const perPage = params.perPage;

  const data = await prisma.assetCategory.findMany({
    orderBy: {
      assets: {
        _count: "desc",
      },
    },
    skip: (page - 1) * perPage,
    take: perPage,
    include: { assets: true, _count: true },
  });
  const total = await prisma.assetCategory.count();

  return {
    page,
    perPage,
    total,
    items: data.map((cat) => listAssetCategoryMapper(cat)),
  };
};
