import { Asset } from "@prisma/client";

import prisma from "../../prisma/client";
import { CreateAssetDto, CreateAssetImageDto } from "./asset.types";
import { ListWithPagination, PaginationParams } from "../common/models/pagination";
import { baseAssetMapper } from "./asset.mapper";
import { AssetRO } from "./asset.models";

export const createAsset = async (dto: CreateAssetDto): Promise<Asset> => {
  await prisma.assetAuthor.findFirstOrThrow({ where: { id: dto.authorId } });

  await prisma.assetImage.findFirstOrThrow({ where: { id: dto.imageId } });

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

export const saveAssetImage = async (dto: CreateAssetImageDto): Promise<{ id: string }> => {
  const image = await prisma.assetImage.create({
    data: dto,
  });

  return { id: image.id };
};

export const getAssets = async (params: PaginationParams): Promise<ListWithPagination<AssetRO>> => {
  const page = params.page;
  const perPage = params.perPage;

  const data = await prisma.asset.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * perPage,
    take: perPage,
    include: { categories: true, author: true, image: true },
  });
  const total = await prisma.asset.count();

  return {
    page,
    perPage,
    total,
    items: data.map((item) => baseAssetMapper(item)),
  };
};
