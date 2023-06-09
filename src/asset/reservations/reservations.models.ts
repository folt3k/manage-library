export interface ListUserAssetReservationRO {
  expiredAt: Date | null;
  canRent: boolean;
  activeReservationsBefore: number | null;
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
}
