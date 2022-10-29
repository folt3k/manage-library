import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import { createAssetCopy } from "./copies.service";

const router = Router();

router.post(
  "/assets/:assetId/copies",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetCopy = await createAssetCopy(req.params.assetId, req.body);

      res.json(assetCopy);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
