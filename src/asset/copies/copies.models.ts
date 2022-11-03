export interface BaseAssetCopyRO {
  id: string;
  inventoryNumber: string;
  isFreeAccess: boolean;
  canRent: boolean;
  canReserve: boolean;
  isRent: boolean;
  isReserved: boolean;
}

export interface ListAssetCopyRO extends BaseAssetCopyRO {
  activeReservationsCount: number;
}
