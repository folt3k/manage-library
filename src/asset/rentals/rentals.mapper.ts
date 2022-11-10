import { Asset, AssetAuthor, AssetCopy, AssetRental, User } from "@prisma/client";
import { ListAssetRentalRO } from "./rentals.models";

export const listAssetRental = (
  assetRental: AssetRental & {
    user: User;
    copy: AssetCopy & { asset: Asset & { author: AssetAuthor } };
  }
): ListAssetRentalRO => ({
  id: assetRental.id,
  createdAt: assetRental.createdAt,
  expiredAt: assetRental.expiredAt,
  returnedAt: assetRental.returnedAt,
  isReturned: assetRental.isReturned,
  copy: {
    id: assetRental.copy.id,
    inventoryNumber: assetRental.copy.inventoryNumber,
  },
  asset: {
    id: assetRental.copy.asset.id,
    title: assetRental.copy.asset.title,
    author: {
      firstName: assetRental.copy.asset.author.firstName,
      lastName: assetRental.copy.asset.author.lastName,
    },
  },
  user: {
    id: assetRental.user.id,
    firstName: assetRental.user.firstName,
    lastName: assetRental.user.lastName,
  },
});
