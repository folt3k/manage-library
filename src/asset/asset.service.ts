import { omit } from "lodash";
import { AssetType } from "@prisma/client";

import prisma from "../../prisma/client";
import { UpsertAssetDto, CreateAssetImageDto } from "./asset.types";
import { ListWithPagination, PaginationParams } from "../common/types/pagination";
import { baseAssetMapper } from "./asset.mapper";
import { BaseAssetRO } from "./asset.models";
import { getAssetCopies } from "./copies/copies.service";
import { CurrentUser } from "../auth/auth.models";
import { BaseAssetCopyRO } from "./copies/copies.models";
import httpErrors from "../common/utils/http-error.util";
import { SortParams } from "../common/types/sort";
import { prepareOrderBy } from "../common/utils/sort.utils";
import { mapParamToArray } from "../common/utils/filters.utils";

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
  await prisma.asset.update({ where: { id: assetId }, data: { disabled: true } });

  const copies = await prisma.assetCopy.findMany({ select: { id: true }, where: { assetId } });

  for (const copy of copies) {
    await prisma.assetCopy.update({ where: { id: copy.id }, data: { disabled: true } });
  }

  return undefined;
};

export const saveAssetImage = async (dto: CreateAssetImageDto): Promise<{ id: string }> => {
  const image = await prisma.assetImage.create({
    data: dto,
  });

  return { id: image.id };
};

export const getAssets = async (
  params: PaginationParams &
    SortParams & {
      title?: string;
      type?: AssetType[] | AssetType;
      author?: string[] | string;
      category?: string[] | string;
    }
): Promise<ListWithPagination<BaseAssetRO>> => {
  const page = params.page;
  const perPage = params.perPage;

  const typesParam = mapParamToArray(params.type);
  const authorsParam = mapParamToArray(params.author);
  const categoriesParam = mapParamToArray(params.category);

  const orderBy = prepareOrderBy(
    params,
    ({ sortBy, sortOrder }) => {
      switch (sortBy) {
        case "title":
          return {
            title: sortOrder,
          };
        case "author":
          return {
            author: {
              lastName: sortOrder,
            },
          };
      }
    },
    {
      createdAt: "desc",
    }
  );

  const where: object = {
    disabled: false,
    ...(params.title
      ? {
          title: {
            contains: params.title,
            mode: "insensitive",
          },
        }
      : null),
    ...(typesParam.length
      ? {
          type: { in: typesParam },
        }
      : null),
    ...(authorsParam.length
      ? {
          authorId: { in: authorsParam },
        }
      : null),
    ...(categoriesParam.length
      ? {
          categories: {
            some: {
              id: { in: categoriesParam },
            },
          },
        }
      : null),
  };

  const data = await prisma.asset.findMany({
    where,
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage,
    include: { categories: true, author: true, image: true },
  });
  const total = await prisma.asset.count({ where });

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
  const asset = await prisma.asset.findFirst({
    where: { id, disabled: false },
    include: { categories: true, author: true, image: true },
  });

  if (!asset || asset?.disabled) {
    throw httpErrors.notFound("Nie znaleziono takiej książki lub nie jest ona aktywna");
  }

  const assetCopies = await getAssetCopies(asset.id, currentUser);

  return {
    ...baseAssetMapper(asset),
    copies: assetCopies,
  };
};
