import { AssetCopy } from "@prisma/client";
import { BaseAssetCopyRO, ListAssetCopyRO } from "./copies.models";

export type BaseCopyMapperInput = {
  canRent: boolean;
  canReserve: boolean;
  isRent: boolean;
  isReserved: boolean;
} & AssetCopy;

export const baseAssetCopyMapper = (copy: BaseCopyMapperInput): BaseAssetCopyRO => ({
  id: copy.id,
  inventoryNumber: copy.inventoryNumber,
  isFreeAccess: copy.isFreeAccess,
  canRent: copy.canRent,
  canReserve: copy.canReserve,
  isRent: copy.isRent,
  isReserved: copy.isReserved,
});

export const listAssetCopyMapper = (
  copy: BaseCopyMapperInput & { activeReservationsCount: number }
): ListAssetCopyRO => ({
  ...baseAssetCopyMapper(copy),
  activeReservationsCount: copy.activeReservationsCount,
});
