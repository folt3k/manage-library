import { Router } from "express";

import userController from "./user/user.controller";
import authController from "./auth/auth.controller";
import assetSubjectController from "./asset/subject/subject.controller";
import assetAuthorController from "./asset/author/author.controller";

const router = Router();

const api = router
  .use(userController)
  .use(authController)
  .use(assetSubjectController)
  .use(assetAuthorController);

export default router.use("/api", api);
