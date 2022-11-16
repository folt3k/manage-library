import { UserRole } from "@prisma/client";
import { NextFunction, Router, Request, Response } from "express";

import { auth } from "../../auth/auth.middlewares";
import {
  createAssetAuthor,
  getAllAssetAuthors,
  getAssetAuthors,
  removeAssetAuthor,
  updateAssetAuthor,
} from "./author.service";
import { getPaginationParamsFromQuery } from "../../common/utils/pagination.utils";

const router = Router();

router.post(
  "/asset-authors",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetAuthor = await createAssetAuthor(req.body);

      res.json(assetAuthor);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/asset-authors/:authorId",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetAuthor = await updateAssetAuthor(req.params.authorId, req.body);

      res.json(assetAuthor);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/asset-authors/:authorId",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await removeAssetAuthor(req.params.authorId);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/asset-authors",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    const params = getPaginationParamsFromQuery(req.query);

    try {
      const assetSubjects = await getAssetAuthors(params);

      res.json(assetSubjects);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/asset-authors/all",
  auth({ roles: [UserRole.LIBRARIAN] }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assetSubjects = await getAllAssetAuthors();

      res.json(assetSubjects);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
