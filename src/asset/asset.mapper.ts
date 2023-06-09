import { Asset, AssetAuthor, AssetCategory } from "@prisma/client";

import { BaseAssetRO } from "./asset.models";
import { baseAssetCategoryMapper } from "./categories/categories.mapper";

export const baseAssetMapper = (
  asset: Asset & {
    image: { id: string; path: string };
    categories: AssetCategory[];
    author: AssetAuthor;
  }
): BaseAssetRO => ({
  id: asset.id,
  title: asset.title,
  publisher: asset.publisher,
  publicationYear: asset.publicationYear,
  description: asset.description,
  isbn: asset.isbn,
  type: asset.type,
  lubimyczytacLink: asset.lubimyczytacLink,
  categories: asset.categories.map((cat) => baseAssetCategoryMapper(cat)),
  author: asset.author,
  image: { id: asset.image.id, path: `${process.env.APP_URL}/${asset.image.path}` },
});
