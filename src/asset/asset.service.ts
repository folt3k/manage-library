import { omit } from "lodash";

import prisma from "../../prisma/client";
import { UpsertAssetDto, CreateAssetImageDto } from "./asset.types";
import { ListWithPagination, PaginationParams } from "../common/models/pagination";
import { baseAssetMapper } from "./asset.mapper";
import { BaseAssetRO } from "./asset.models";
import { getAssetCopies } from "./copies/copies.service";
import { CurrentUser } from "../auth/auth.models";
import { BaseAssetCopyRO } from "./copies/copies.models";

export const createAsset = async (dto: UpsertAssetDto): Promise<{ id: string }> => {
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

export const updateAsset = async (assetId: string, dto: UpsertAssetDto): Promise<void> => {
  await prisma.asset.update({
    where: {
      id: assetId,
    },
    data: {
      ...omit(dto, ["imageId", "authorId"]),
      ...(dto.authorId
        ? {
            author: {
              connect: {
                id: dto.authorId,
              },
            },
          }
        : null),
      ...(dto.imageId
        ? {
            image: {
              connect: {
                id: dto.imageId,
              },
            },
          }
        : null),
      categories: {
        connect: dto.categoryIds.map((category) => ({ id: category })),
      },
    },
  });

  return undefined;
};

export const removeAsset = async (assetId: string): Promise<void> => {
  await prisma.asset.delete({ where: { id: assetId } });

  return undefined;
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
  id: string,
  currentUser: CurrentUser
): Promise<BaseAssetRO & { copies: BaseAssetCopyRO[] }> => {
  const asset = await prisma.asset.findFirstOrThrow({
    where: { id },
    include: { categories: true, author: true, image: true },
  });

  const assetCopies = await getAssetCopies(asset.id, currentUser);

  return {
    ...baseAssetMapper(asset),
    copies: assetCopies,
  };
};
