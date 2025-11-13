import { Router } from "express";
import { createBill, getStoreBills } from "../controllers/billing.controller.js";
import { verifyStoreJWT } from "../middlewares/storeAuth.middleware.js";

const router = Router();

// All billing routes are protected
router.use(verifyStoreJWT);

router.route("/")
  .post(createBill)
  .get(getStoreBills);
  
export default router;