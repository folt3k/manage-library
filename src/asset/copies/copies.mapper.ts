import { AssetCopy } from "@prisma/client";
import { BaseAssetCopyRO } from "./copies.models";
import { AssetCopyStatus } from "./copies.types";

export const baseAssetCopyMapper = (
  copy: AssetCopy & { status: AssetCopyStatus; canRent: boolean }
): BaseAssetCopyRO => ({
  id: copy.id,
  inventoryNumber: copy.inventoryNumber,
  isFreeAccess: copy.isFreeAccess,
  status: copy.status,
  canRent: copy.canRent,
});
