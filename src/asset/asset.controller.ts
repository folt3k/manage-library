import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../auth/auth.middlewares";
import { createAsset, getAssets } from "./asset.service";
import { getPaginationParamsFromQuery } from "../common/utils/pagination.utils";
import uploadImage from "../common/utils/multer.util";

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
      // const asset = await createAsset(req.body);

      res.json(req.file);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
