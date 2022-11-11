import { AssetCopy, AssetRental, AssetReservation, UserRole } from "@prisma/client";
import { CurrentUser } from "../../auth/auth.models";

export const canRentCopy = (
  copy: AssetCopy & { rentals: AssetRental[]; reservations: AssetReservation[] },
  currentUser: CurrentUser
): boolean => {
  if (copy.isFreeAccess) {
    return false;
  }

  if (currentUser.role === UserRole.LIBRARIAN) {
    return false;
  }

  if (copy.rentals.length) {
    return false;
  }

  if (copy.reservations.length) {
    if (copy.reservations[0].userId !== currentUser.id) {
      return false;
    }
  }

  return true;
};

export const canReserveCopy = (
  copy: AssetCopy & { rentals: AssetRental[]; reservations: AssetReservation[] },
  currentUser: CurrentUser
): boolean => {
  if (copy.isFreeAccess) {
    return false;
  }

  if (currentUser.role === UserRole.LIBRARIAN) {
    return false;
  }

  if (copy.rentals.find((r) => r.userId === currentUser.id)) {
    return false;
  }

  if (copy.reservations.length) {
    if (copy.reservations.find((r) => r.userId === currentUser.id)) {
      return false;
    }
  }

  if (!copy.rentals.length && !copy.reservations.length) {
    return false;
  }

  return true;
};

export const isCopyRent = (copy: AssetCopy & { rentals: AssetRental[] }): boolean => {
  return !!copy.rentals.length;
};

export const isCopyRentByCurrentUser = (
  copy: AssetCopy & { rentals: AssetRental[] },
  currentUser: CurrentUser
): boolean => {
  return !!copy.rentals.find((rental) => rental.userId === currentUser.id);
};
