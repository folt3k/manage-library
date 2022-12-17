export interface AssetRentalsListFilterParams {
  title?: string;
  inventoryNumber?: string;
  reader?: string;
  status?: AssetRentalStatusFilter;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  returnedDateFrom?: string;
  returnedDateTo?: string;
}

export type AssetRentalStatusFilter = "Returned" | "NotReturned";
