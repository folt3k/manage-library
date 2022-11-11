import { AssetReservation } from "@prisma/client";

import { CurrentUser } from "../../auth/auth.models";

export const isCopyReservedByCurrentUser = (
  reservations: AssetReservation[],
  currentUser: CurrentUser
): boolean => {
  return !!reservations.find((res) => res.userId === currentUser.id);
};

export const activeReservationsBeforeUserReservation = (
  reservations: AssetReservation[],
  currentUser: CurrentUser
): number | null => {
  const userReservationIndex = reservations
    .filter((res) => !res.isExpired)
    .findIndex((res) => res.userId === currentUser.id);

  if (userReservationIndex === -1) {
    return null;
  }

  return userReservationIndex;
};
