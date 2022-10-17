import { AssetType } from "@prisma/client";

export interface CreateAssetDto {
  title: string;
  imageUrl?: string;
  publisher: string;
  publicationYear: number;
  description?: string;
  isbn: string;
  lubimyczytacLink?: string;
  type: AssetType;
  authorId: string;
  categoryIds: string[];
}
