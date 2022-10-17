import { Router } from "express";

import userController from "./user/user.controller";
import authController from "./auth/auth.controller";
import assetsController from "./asset/asset.controller";
import assetSubjectController from "./asset/categories/categories.controller";
import assetAuthorController from "./asset/author/author.controller";

const router = Router();

const api = router
  .use(userController)
  .use(authController)
  .use(assetsController)
  .use(assetSubjectController)
  .use(assetAuthorController);

export default router.use("/api", api);
