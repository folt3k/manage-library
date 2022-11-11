export interface BaseListAssetRentalRO {
  id?: string;
  createdAt: Date;
  returnedAt: Date | null;
  expiredAt: Date | null;
  isReturned: boolean;
  copy: {
    id?: string;
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
}

export interface ListAssetRentalRO extends BaseListAssetRentalRO {
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
