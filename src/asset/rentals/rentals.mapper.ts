import { Asset, AssetAuthor, AssetCopy, AssetRental, User } from "@prisma/client";

import { BaseListAssetRentalRO, ListAssetRentalRO } from "./rentals.models";

export const baseListAssetRental = (
  assetRental: AssetRental & {
    user: User;
    copy: AssetCopy & { asset: Asset & { author: AssetAuthor } };
  }
): BaseListAssetRentalRO => ({
  createdAt: assetRental.createdAt,
  expiredAt: assetRental.expiredAt,
  returnedAt: assetRental.returnedAt,
  isReturned: assetRental.isReturned,
  copy: {
    inventoryNumber: assetRental.copy.inventoryNumber,
  },
  asset: {
    title: assetRental.copy.asset.title,
    author: {
      firstName: assetRental.copy.asset.author.firstName,
      lastName: assetRental.copy.asset.author.lastName,
    },
  },
});

export const listAssetRental = (
  assetRental: AssetRental & {
    user: User;
    copy: AssetCopy & { asset: Asset & { author: AssetAuthor } };
  }
): ListAssetRentalRO => {
  const base = baseListAssetRental(assetRental);
  return {
    ...base,
    id: assetRental.id,
    copy: {
      id: assetRental.copy.id,
      ...base.copy,
    },
    asset: {
      ...base.asset,
      id: assetRental.copy.asset.id,
    },
    user: {
      id: assetRental.user.id,
      firstName: assetRental.user.firstName,
      lastName: assetRental.user.lastName,
    },
  };
};
