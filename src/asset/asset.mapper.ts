import { Asset } from "@prisma/client";
import { AssetRO } from "./asset.models";

export const baseAssetMapper = (asset: Asset & { image: { path: string } }): AssetRO => ({
  ...asset,
  image: {
    path: `${process.env.APP_URL}/${asset.image.path}`,
  },
});
