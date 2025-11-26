import { Router } from "express";
import {
  searchProducts,
  getAllProducts,
  getProductById,
  addMedicine // <-- 1. IMPORT addMedicine
} from "../controllers/productCatalog.controller.js";
import { verifyStoreJWT } from "../middlewares/storeAuth.middleware.js";

const router = Router();
router.use(verifyStoreJWT);

router.route("/search").get(searchProducts);

router.route("/").get(getAllProducts).post(addMedicine);

router.route("/:productId").get(getProductById);

export default router;