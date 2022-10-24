import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import {
  createAssetCategory,
  getAllAssetCategories,
  getAssetCategories,
} from "./categories.service";
import { getPaginationParamsFromQuery } from "../../common/utils/pagination.utils";

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
    const params = getPaginationParamsFromQuery(req.query);

    try {
      const assetCategories = await getAssetCategories(params);

      res.json(assetCategories);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/asset-categories/all",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetCategories = await getAllAssetCategories();

      res.json(assetCategories);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
