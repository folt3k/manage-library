import { Asset, AssetAuthor, AssetCopy, AssetRental, AssetReservation } from "@prisma/client";

import { ListUserAssetReservationRO } from "./reservations.models";
import { canRentCopy } from "../copies/copies.utils";
import { CurrentUser } from "../../auth/auth.models";
import { activeReservationsBeforeUserReservation } from "./reservations.utils";

export const listUserAssetReservation = (
  data: AssetReservation & {
    copy: AssetCopy & {
      asset: Asset & { author: AssetAuthor };
      rentals: AssetRental[];
      reservations: AssetReservation[];
    };
  },
  currentUser: CurrentUser
): ListUserAssetReservationRO => ({
  expiredAt: data.expiredAt,
  canRent: canRentCopy(data.copy, currentUser),
  activeReservationsBefore: activeReservationsBeforeUserReservation(
    data.copy.reservations,
    currentUser
  ),
  copy: {
    inventoryNumber: data.copy.inventoryNumber,
  },
  asset: {
    id: data.copy.asset.title,
    title: data.copy.asset.title,
    author: {
      firstName: data.copy.asset.author.firstName,
      lastName: data.copy.asset.author.lastName,
    },
  },
});
