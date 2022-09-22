import { AssetSubject } from "@prisma/client";

import prisma from "../../../prisma/client";
import { createAssetSubjectDto } from "./subject.types";

export const createAssetSubject = async (dto: createAssetSubjectDto): Promise<AssetSubject> => {
  const assetSubject = await prisma.assetSubject.create({ data: dto });

  return assetSubject;
};

export const getAssetSubjects = async (): Promise<AssetSubject[]> => {
  const assetSubjects = await prisma.assetSubject.findMany();

  return assetSubjects;
};
