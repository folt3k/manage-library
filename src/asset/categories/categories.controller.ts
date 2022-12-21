import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import {
  createAssetCategory,
  getAllAssetCategories,
  getAssetCategories,
  removeAssetCategory,
  updateAssetCategory,
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

router.put(
  "/asset-categories/:categoryId",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetCategory = await updateAssetCategory(req.params.categoryId, req.body);

      res.json(assetCategory);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/asset-categories/:categoryId",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await removeAssetCategory(req.params.categoryId);

      res.sendStatus(204);
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
      const assetCategories = await getAssetCategories({ ...req.query, ...params });

      res.json(assetCategories);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/asset-categories/all",
  auth(),
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
