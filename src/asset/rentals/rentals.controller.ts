import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import { closeAssetRental, createAssetRental } from "./rentals.service";

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

export default router;
