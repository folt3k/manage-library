import { Router } from "express";

import userController from "./user/user.controller";
import authController from "./auth/auth.controller";
import assetSubjectController from "./asset/subject/subject.controller";

const router = Router();

const api = router.use(userController).use(authController).use(assetSubjectController);

export default router.use("/api", api);
