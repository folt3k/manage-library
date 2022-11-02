import { AssetCopyStatus } from "./copies.types";

export interface BaseAssetCopyRO {
  id: string;
  inventoryNumber: string;
  isFreeAccess: boolean;
  status: AssetCopyStatus;
  canRent: boolean;
}
