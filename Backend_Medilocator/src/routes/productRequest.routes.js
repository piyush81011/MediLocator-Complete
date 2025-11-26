import { Router } from "express";
import {
  createProductRequest,
  getStoreProductRequests,
  getProductRequestById,
  deleteProductRequest
} from "../controllers/productRequest.controller.js";
import { verifyStoreJWT } from "../middlewares/storeAuth.middleware.js";

const router = Router();

// All routes are protected
router.use(verifyStoreJWT);

router.route("/").post(createProductRequest).get(getStoreProductRequests);
router.route("/:requestId").get(getProductRequestById).delete(deleteProductRequest);

export default router;
