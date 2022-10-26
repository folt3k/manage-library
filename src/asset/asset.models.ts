import { AssetAuthor } from "@prisma/client";
import { BaseAssetCategoryRO } from "./categories/categories.models";

export interface AssetRO {
  id: string;
  title: string;
  publisher: string;
  publicationYear: number;
  description: string | null;
  isbn: string;
  type: string;
  lubimyczytacLink: string | null;
  image: {
    path: string;
  };
  categories: BaseAssetCategoryRO[];
  author: AssetAuthor;
}
