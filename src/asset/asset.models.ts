import { Asset } from "@prisma/client";

export interface AssetRO extends Asset {
  image: {
    path: string;
  };
}
