import { AssetCopy } from "@prisma/client";
import { BaseAssetCopyRO } from "./copies.models";
import { AssetCopyStatus } from "./copies.types";

export const baseAssetCopyMapper = (
  copy: AssetCopy & { status: AssetCopyStatus }
): BaseAssetCopyRO => ({
  id: copy.id,
  inventoryNumber: copy.inventoryNumber,
  isFreeAccess: copy.isFreeAccess,
  status: copy.status,
});
