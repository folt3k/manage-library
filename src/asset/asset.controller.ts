import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../auth/auth.middlewares";
import { createAsset, getAssets } from "./asset.service";

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
  try {
    const assets = await getAssets();

    res.json(assets);
  } catch (err) {
    next(err);
  }
});

export default router;
