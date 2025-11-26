// import { Router } from "express";
// import { createBill, getStoreBills } from "../controllers/billing.controller.js";
// import { verifyStoreJWT } from "../middlewares/storeAuth.middleware.js";

// const router = Router();

// // All billing routes are protected
// router.use(verifyStoreJWT);

// router.route("/")
//   .post(createBill)
//   .get(getStoreBills);
  
// export default router;

import { Router } from "express";
import { 
  createBill, 
  getStoreBills, 
  getBillingHistory,
  getDailySalesStats 
} from "../controllers/billing.controller.js";
import { verifyStoreJWT } from "../middlewares/storeAuth.middleware.js";

const router = Router();

router.post("/", verifyStoreJWT, createBill);
router.get("/", verifyStoreJWT, getStoreBills);
router.get("/history", verifyStoreJWT, getBillingHistory);
router.get("/stats/daily", verifyStoreJWT, getDailySalesStats);

export default router;