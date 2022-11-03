import { AssetCopy } from "@prisma/client";
import { BaseAssetCopyRO, ListAssetCopyRO } from "./copies.models";

export const baseAssetCopyMapper = (
  copy: AssetCopy & { canRent: boolean; canReserve: boolean }
): BaseAssetCopyRO => ({
  id: copy.id,
  inventoryNumber: copy.inventoryNumber,
  isFreeAccess: copy.isFreeAccess,
  canRent: copy.canRent,
  canReserve: copy.canReserve,
});

export const listAssetCopyMapper = (
  copy: AssetCopy & { canRent: boolean; canReserve: boolean; activeReservationsCount: number }
): ListAssetCopyRO => ({
  ...baseAssetCopyMapper(copy),
  activeReservationsCount: copy.activeReservationsCount,
});
