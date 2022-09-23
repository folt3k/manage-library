import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import { createAssetAuthor, getAssetAuthors } from "./author.service";

const router = Router();

router.post(
  "/asset-authors",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetSubject = await createAssetAuthor(req.body);

      res.json(assetSubject);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/asset-authors",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetSubjects = await getAssetAuthors();

      res.json(assetSubjects);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
