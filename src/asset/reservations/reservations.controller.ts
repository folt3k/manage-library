import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import { createAssetReservation, getAssetReservationsByUserId } from "./reservations.service";
import { getPaginationParamsFromQuery } from "../../common/utils/pagination.utils";

const router = Router();

router.post(
  "/asset-copies/:copyId/reservations",
  auth({ roles: [UserRole.READER] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await createAssetReservation(req.params.copyId, req.user);

      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/asset-reservations/me",
  auth({ roles: [UserRole.READER] }),
  async (req: Request, res: Response, next: NextFunction) => {
    const params = getPaginationParamsFromQuery(req.query);

    try {
      const assets = await getAssetReservationsByUserId(req.user, params);

      res.json(assets);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
