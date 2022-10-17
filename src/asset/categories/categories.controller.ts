import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import { createAssetCategory, getAssetCategories } from "./categories.service";

const router = Router();

router.post(
  "/asset-categories",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetCategory = await createAssetCategory(req.body);

      res.json(assetCategory);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/asset-categories",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetCategories = await getAssetCategories();

      res.json(assetCategories);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
