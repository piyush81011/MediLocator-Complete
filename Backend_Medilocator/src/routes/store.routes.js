import { Router } from "express";
import {
  registerStore,
  loginStore,
  logoutStore,
  getCurrentStore,
  updateStoreDetails,
  changeStorePassword
} from "../controllers/stores.controller.js";
import { verifyStoreJWT } from "../middlewares/storeAuth.middleware.js";

const router = Router();

router.route("/register").post(registerStore);
router.route("/login").post(loginStore);

// Secured routes
router.route("/logout").post(verifyStoreJWT, logoutStore);
router.route("/current").get(verifyStoreJWT, getCurrentStore);
router.route("/update").patch(verifyStoreJWT, updateStoreDetails);
router.route("/change-password").post(verifyStoreJWT, changeStorePassword);

export default router;
