import { AssetCategory } from "@prisma/client";

import prisma from "../../../prisma/client";
import { UpsertAssetCategoryDto } from "./categories.types";
import httpErrors from "../../common/utils/http-error.util";
import { ListWithPagination, PaginationParams } from "../../common/types/pagination";
import { ListAssetCategoryRO } from "./categories.models";
import { listAssetCategoryMapper } from "./categories.mapper";
import { Option } from "../../common/types/option";
import { SortParams } from "../../common/types/sort";
import { prepareOrderBy } from "../../common/utils/sort.utils";

export const createAssetCategory = async (dto: UpsertAssetCategoryDto): Promise<AssetCategory> => {
  const categoryExists = await prisma.assetCategory.findFirst({
    where: { name: dto.name.toLowerCase() },
  });

  if (categoryExists) {
    throw httpErrors.badRequest("Kategoria z taką nazwą już istnieje");
  }

  return await prisma.assetCategory.create({ data: { name: dto.name.toLowerCase() } });
};

export const updateAssetCategory = async (
  categoryId: string,
  dto: UpsertAssetCategoryDto
): Promise<AssetCategory> => {
  const assetCategory = await prisma.assetCategory.update({ where: { id: categoryId }, data: dto });

  return assetCategory;
};

export const removeAssetCategory = async (categoryId: string): Promise<AssetCategory> => {
  return await prisma.assetCategory.delete({ where: { id: categoryId } });
};

export const getAssetCategories = async (
  params: PaginationParams & SortParams & { q?: string }
): Promise<ListWithPagination<ListAssetCategoryRO>> => {
  const page = params.page;
  const perPage = params.perPage;

  const orderBy = prepareOrderBy(
    params,
    ({ sortBy, sortOrder }) => {
      switch (sortBy) {
        case "name":
          return {
            name: sortOrder,
          };
        case "assetsCount":
          return {
            assets: {
              _count: sortOrder,
            },
          };
      }
    },
    {
      assets: {
        _count: "desc",
      },
    }
  );

  const where: object = {
    ...(params.q
      ? {
          name: {
            contains: params.q,
            mode: "insensitive",
          },
        }
      : null),
  };

  const data = await prisma.assetCategory.findMany({
    where,
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage,
    include: { assets: true, _count: true },
    // TODO: Problem z sortowanie - sortowanie po liczbie tylko aktywnych assetów
    //  _count: { select: { assets: { where: { disabled: false } } } },
  });
  const total = await prisma.assetCategory.count({ where });

  return {
    page,
    perPage,
    total,
    items: data.map((cat) => listAssetCategoryMapper(cat)),
  };
};

export const getAllAssetCategories = async (): Promise<Option<string>[]> => {
  const data = await prisma.assetCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return data.map((item) => ({ value: item.id, label: item.name }));
};
