export interface BaseAssetCopyRO {
  id: string;
  inventoryNumber: string;
  isFreeAccess: boolean;
  canRent: boolean;
  canReserve: boolean;
  isRent: boolean;
  isRentByCurrentUser: boolean;
  isReservedByCurrentUser: boolean;
  activeReservationsCount: number;
  rentExpiredAt: Date | null;
}
