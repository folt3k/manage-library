import { AssetRental } from "@prisma/client";

export interface BaseAssetRentalRO extends AssetRental {}

export interface ListAssetRentalRO {
  id: string;
  createdAt: Date;
  returnedAt: Date | null;
  expiredAt: Date | null;
  isReturned: boolean;
  copy: {
    id: string;
    inventoryNumber: string;
  };
  asset: {
    id: string;
    title: string;
    author: {
      firstName: string;
      lastName: string;
    };
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
