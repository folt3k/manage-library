import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import { createAssetReservation } from "./reservations.service";

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

export default router;
