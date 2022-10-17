import { AssetCategory } from "@prisma/client";

import { ListAssetCategoryRO } from "./categories.models";

export const listAssetCategoryMapper = (
  cat: AssetCategory & { _count: { assets: number } }
): ListAssetCategoryRO => ({
  id: cat.id,
  name: cat.name,
  assetsCount: cat._count.assets,
});
