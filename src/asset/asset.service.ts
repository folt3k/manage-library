import { Asset } from "@prisma/client";

import prisma from "../../prisma/client";
import { CreateAssetDto } from "./asset.types";
import { ListWithPagination, PaginationParams } from "../common/models/pagination";

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

export const getAssets = async (params: PaginationParams): Promise<ListWithPagination<Asset>> => {
  const page = params.page;
  const perPage = params.perPage;

  const data = await prisma.asset.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * perPage,
    take: perPage,
    include: { categories: true, author: true },
  });
  const total = await prisma.asset.count();

  return {
    page,
    perPage,
    total,
    items: data,
  };
};
