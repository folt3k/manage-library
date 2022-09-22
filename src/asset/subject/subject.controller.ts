import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import { createAssetSubject, getAssetSubjects } from "./subject.service";

const router = Router();

router.post(
  "/asset-subjects",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetSubject = await createAssetSubject(req.body);

      res.json(assetSubject);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/asset-subjects",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetSubjects = await getAssetSubjects();

      res.json(assetSubjects);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
