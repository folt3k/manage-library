import { Router } from "express";

import userController from "./user/user.controller";
import authController from "./auth/auth.controller";

const router = Router();

const api = router.use(userController).use(authController);

export default router.use("/api", api);
