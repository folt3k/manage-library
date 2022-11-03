import { omit } from "lodash";

import prisma from "../../prisma/client";
import { CreateAssetDto, CreateAssetImageDto } from "./asset.types";
import { ListWithPagination, PaginationParams } from "../common/models/pagination";
import { baseAssetMapper } from "./asset.mapper";
import { BaseAssetRO } from "./asset.models";
import { getAssetCopies } from "./copies/copies.service";
import { BaseAssetCopyRO } from "./copies/copies.models";

export const createAsset = async (dto: CreateAssetDto): Promise<{ id: string }> => {
  const asset = await prisma.asset.create({
    data: {
      ...omit(dto, ["imageId", "authorId"]),
      author: {
        connect: {
          id: dto.authorId,
        },
      },
      image: {
        connect: {
          id: dto.imageId,
        },
      },
      categories: {
        connect: dto.categoryIds.map((category) => ({ id: category })),
      },
    },
  });

  return { id: asset.id };
};

export const saveAssetImage = async (dto: CreateAssetImageDto): Promise<{ id: string }> => {
  const image = await prisma.assetImage.create({
    data: dto,
  });

  return { id: image.id };
};

export const getAssets = async (
  params: PaginationParams
): Promise<ListWithPagination<BaseAssetRO>> => {
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

export const getAsset = async (
  id: string
): Promise<BaseAssetRO & { copies: BaseAssetCopyRO[] }> => {
  const asset = await prisma.asset.findFirstOrThrow({
    where: { id },
    include: { categories: true, author: true, image: true },
  });

  const assetCopies = await getAssetCopies(asset.id);

  return {
    ...baseAssetMapper(asset),
    copies: assetCopies,
  };
};
