import { AssetAuthor } from "@prisma/client";

import { BaseAssetCategoryRO } from "./categories/categories.models";

export interface BaseAssetRO {
  id: string;
  title: string;
  publisher: string;
  publicationYear: number;
  description: string | null;
  isbn: string;
  type: string;
  lubimyczytacLink: string | null;
  image: {
    id: string;
    path: string;
  };
  categories: BaseAssetCategoryRO[];
  author: AssetAuthor;
}
