import { Router } from "express";

import userController from "./user/user.controller";
import authController from "./auth/auth.controller";
import assetsController from "./asset/asset.controller";
import assetSubjectController from "./asset/categories/categories.controller";
import assetAuthorController from "./asset/author/author.controller";
import assetCopiesController from "./asset/copies/copies.controller";
import assetRentalsController from "./asset/rentals/rentals.controller";
import assetReservationsController from "./asset/reservations/reservations.controller";
import chatController from "./chat/chat.controller";

const router = Router();

const api = router
  .use(userController)
  .use(authController)
  .use(assetsController)
  .use(assetSubjectController)
  .use(assetAuthorController)
  .use(assetCopiesController)
  .use(assetRentalsController)
  .use(assetReservationsController)
  .use(chatController);

export default router.use("/api", api);
