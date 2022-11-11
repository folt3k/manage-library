import { AssetCopy, AssetRental, AssetReservation } from "@prisma/client";
import { CurrentUser } from "../../auth/auth.models";
import { BaseAssetCopyRO } from "./copies.models";
import { canRentCopy, canReserveCopy, isCopyRent, isCopyRentByCurrentUser } from "./copies.utils";
import { isCopyReservedByCurrentUser } from "../reservations/reservations.utils";

export const baseAssetCopyMapper = (
  copy: AssetCopy & { rentals: AssetRental[]; reservations: AssetReservation[] },
  currentUser: CurrentUser
): BaseAssetCopyRO => ({
  id: copy.id,
  inventoryNumber: copy.inventoryNumber,
  isFreeAccess: copy.isFreeAccess,
  canRent: canRentCopy(copy, currentUser),
  canReserve: canReserveCopy(copy, currentUser),
  isRent: isCopyRent(copy),
  isRentByCurrentUser: isCopyRentByCurrentUser(copy, currentUser),
  isReservedByCurrentUser: isCopyReservedByCurrentUser(copy.reservations, currentUser),
  activeReservationsCount: copy.reservations.length,
  rentExpiredAt: copy.rentals.length ? copy.rentals[0].expiredAt : null,
});
