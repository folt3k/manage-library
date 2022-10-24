import { AssetAuthor } from "@prisma/client";

import prisma from "../../../prisma/client";
import { CreateAssetAuthorDto } from "./author.types";
import { ListWithPagination, PaginationParams } from "../../common/models/pagination";
import { listAssetAuthorMapper } from "./authors.mapper";
import { Option } from "../../common/types/option";

export const createAssetAuthor = async (dto: CreateAssetAuthorDto): Promise<AssetAuthor> => {
  const assetAuthor = await prisma.assetAuthor.create({ data: dto });

  return assetAuthor;
};

export const getAssetAuthors = async (
  params: PaginationParams
): Promise<ListWithPagination<AssetAuthor>> => {
  const page = params.page;
  const perPage = params.perPage;

  const data = await prisma.assetAuthor.findMany({
    orderBy: {
      assets: {
        _count: "desc",
      },
    },
    skip: (page - 1) * perPage,
    take: perPage,
    include: { assets: true, _count: true },
  });
  const total = await prisma.assetAuthor.count();

  return {
    page,
    perPage,
    total,
    items: data.map((author) => listAssetAuthorMapper(author)),
  };
};

export const getAllAssetAuthors = async (): Promise<Option<string>[]> => {
  const data = await prisma.assetAuthor.findMany({
    orderBy: {
      lastName: "asc",
    },
  });

  return data.map((item) => ({ value: item.id, label: `${item.lastName} ${item.firstName}` }));
};
