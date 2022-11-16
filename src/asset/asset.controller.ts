import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../auth/auth.middlewares";
import {
  createAsset,
  getAsset,
  getAssets,
  removeAsset,
  saveAssetImage,
  updateAsset,
} from "./asset.service";
import { getPaginationParamsFromQuery } from "../common/utils/pagination.utils";
import uploadImage from "../common/utils/multer.util";
import { CreateAssetImageDto } from "./asset.types";

const router = Router();

router.post(
  "/assets",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asset = await createAsset(req.body);

      res.json(asset);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/assets/:assetId",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asset = await updateAsset(req.params.assetId, req.body);

      res.json(asset);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/assets/:assetId",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await removeAsset(req.params.assetId);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/assets", auth(), async (req: Request, res: Response, next: NextFunction) => {
  const params = getPaginationParamsFromQuery(req.query);

  try {
    const assets = await getAssets(params);

    res.json(assets);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/assets/upload",
  auth({ roles: [UserRole.LIBRARIAN] }),
  uploadImage.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: CreateAssetImageDto = {
        fileName: req.file!.filename,
        path: req.file!.path,
      };
      const image = await saveAssetImage(body);

      res.json(image);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/assets/:id", auth(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const asset = await getAsset(req.params.id, req.user);

    res.json(asset);
  } catch (err) {
    next(err);
  }
});

export default router;
