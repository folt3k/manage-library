import { AssetAuthor } from "@prisma/client";

import prisma from "../../../prisma/client";
import { CreateAssetAuthorDto } from "./author.types";

export const createAssetAuthor = async (dto: CreateAssetAuthorDto): Promise<AssetAuthor> => {
  const assetAuthor = await prisma.assetAuthor.create({ data: dto });

  return assetAuthor;
};

export const getAssetAuthors = async (): Promise<AssetAuthor[]> => {
  const assetAuthors = await prisma.assetAuthor.findMany();

  return assetAuthors;
};
