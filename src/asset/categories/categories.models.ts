export interface BaseAssetCategoryRO {
  id: string;
  name: string;
}

export interface ListAssetCategoryRO extends BaseAssetCategoryRO {
  assetsCount: number;
}
