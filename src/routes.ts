import { Router } from "express";

import userController from "./user/user.controller";

const router = Router();

const api = router.use(userController);

export default router.use("/api", api);
