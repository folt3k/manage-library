import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import { createAssetRental } from "./rentals.service";

const router = Router();

router.post(
  "/asset-copies/:copyId/rentals",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await createAssetRental(req.params.copyId, req.user);

      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
