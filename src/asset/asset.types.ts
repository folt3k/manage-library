import { AssetType } from "@prisma/client";

export interface UpsertAssetDto {
  title: string;
  imageId: string;
  publisher: string;
  publicationYear: number;
  description?: string;
  isbn: string;
  lubimyczytacLink?: string;
  type: AssetType;
  authorId: string;
  categoryIds: string[];
}

export interface CreateAssetImageDto {
  fileName: string;
  path: string;
}
