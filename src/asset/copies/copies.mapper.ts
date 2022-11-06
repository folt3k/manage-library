import { AssetCopy, AssetRental, AssetReservation } from "@prisma/client";
import { CurrentUser } from "../../auth/auth.models";
import { BaseAssetCopyRO } from "./copies.models";
import { canRent, canReserve, isRent, isReserved } from "./copies.utils";

export const baseAssetCopyMapper = (
  copy: AssetCopy & { rentals: AssetRental[]; reservations: AssetReservation[] },
  currentUser: CurrentUser
): BaseAssetCopyRO => ({
  id: copy.id,
  inventoryNumber: copy.inventoryNumber,
  isFreeAccess: copy.isFreeAccess,
  canRent: canRent(copy, currentUser),
  canReserve: canReserve(copy, currentUser),
  isRent: isRent(copy),
  isReserved: isReserved(copy),
  activeReservationsCount: copy.reservations.length,
  rentExpiredAt: copy.rentals.length ? copy.rentals[0].expiredAt : null,
});
