export interface BaseAssetCopyRO {
  id: string;
  inventoryNumber: string;
  isFreeAccess: boolean;
  canRent: boolean;
  canReserve: boolean;
}

export interface ListAssetCopyRO extends BaseAssetCopyRO {
  activeReservationsCount: number;
}
