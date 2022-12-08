import { AssetAuthor } from "@prisma/client";

import prisma from "../../../prisma/client";
import { UpsertAssetAuthorDto } from "./author.types";
import { ListWithPagination, PaginationParams } from "../../common/models/pagination";
import { listAssetAuthorMapper } from "./authors.mapper";
import { Option } from "../../common/types/option";
import httpErrors from "../../common/utils/http-error.util";

export const createAssetAuthor = async (dto: UpsertAssetAuthorDto): Promise<AssetAuthor> => {
  const assetAuthor = await prisma.assetAuthor.create({ data: dto });

  return assetAuthor;
};

export const updateAssetAuthor = async (
  authorId: string,
  dto: UpsertAssetAuthorDto
): Promise<AssetAuthor> => {
  const assetAuthor = await prisma.assetAuthor.update({ where: { id: authorId }, data: dto });

  return assetAuthor;
};

export const removeAssetAuthor = async (authorId: string): Promise<AssetAuthor> => {
  const numberOfAssetsWithAuthor = await prisma.asset.count({ where: { authorId } });

  if (numberOfAssetsWithAuthor) {
    throw httpErrors.badRequest("Nie można usunąć autora, który jest powiązany z jakimś assetem.");
  }

  return await prisma.assetAuthor.update({ where: { id: authorId }, data: { disabled: true } });
};

export const getAssetAuthors = async (
  params: PaginationParams & { q?: string; sort?: string[] }
): Promise<ListWithPagination<AssetAuthor>> => {
  const page = params.page;
  const perPage = params.perPage;

  const orderBy: Array<object> = [];
  let sort: string[] = [];

  if (params.sort) {
    sort = Array.isArray(params.sort) ? params.sort : [params.sort];
  }

  if (params.sort?.length) {
    sort.reverse().forEach((param) => {
      const [key, value] = param.split(":");

      switch (key) {
        case "name":
          orderBy.push({
            lastName: value,
          });
          break;
        case "assetsCount":
          orderBy.push({
            assets: {
              _count: value,
            },
          });

          break;
      }
    });
  } else {
    orderBy.push({
      assets: {
        _count: "desc",
      },
    });
  }

  const data = await prisma.assetAuthor.findMany({
    where: {
      ...(params.q
        ? {
            OR: [
              {
                firstName: {
                  contains: params.q,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: params.q,
                  mode: "insensitive",
                },
              },
            ],
          }
        : null),
      disabled: false,
    },
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage,
    include: { assets: true, _count: true },
  });
  const total = await prisma.assetAuthor.count({ where: { disabled: false } });

  return {
    page,
    perPage,
    total,
    items: data.map((author) => listAssetAuthorMapper(author)),
  };
};

export const getAllAssetAuthors = async (): Promise<Option<string>[]> => {
  const data = await prisma.assetAuthor.findMany({
    where: {
      disabled: false,
    },
    orderBy: {
      lastName: "asc",
    },
  });

  return data.map((item) => ({ value: item.id, label: `${item.lastName} ${item.firstName}` }));
};
