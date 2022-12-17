import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import {
  closeAssetRental,
  createAssetRental,
  getAssetRentals,
  getAssetRentalsByUserId,
} from "./rentals.service";
import { getPaginationParamsFromQuery } from "../../common/utils/pagination.utils";

const router = Router();

router.post(
  "/asset-copies/:copyId/rentals",
  auth({ roles: [UserRole.READER] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await createAssetRental(req.params.copyId, req.user);

      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/asset-rentals/:rentalId/close",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await closeAssetRental(req.params.rentalId, req.user);

      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/asset-rentals",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    const paginationParams = getPaginationParamsFromQuery(req.query);

    try {
      const assets = await getAssetRentals({ ...req.query, ...paginationParams });

      res.json(assets);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/asset-rentals/me",
  auth({ roles: [UserRole.READER] }),
  async (req: Request, res: Response, next: NextFunction) => {
    const params = getPaginationParamsFromQuery(req.query);

    try {
      const assets = await getAssetRentalsByUserId(req.user.id, params);

      res.json(assets);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
