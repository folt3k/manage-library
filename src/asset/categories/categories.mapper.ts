import { AssetCategory } from "@prisma/client";

import { BaseAssetCategoryRO, ListAssetCategoryRO } from "./categories.models";

export const baseAssetCategoryMapper = (cat: AssetCategory): BaseAssetCategoryRO => ({
  id: cat.id,
  name: cat.name,
});

export const listAssetCategoryMapper = (
  cat: AssetCategory & { _count: { assets: number } }
): ListAssetCategoryRO => ({
  ...baseAssetCategoryMapper(cat),
  assetsCount: cat._count.assets,
});
