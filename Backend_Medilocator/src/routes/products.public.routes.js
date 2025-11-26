import { Router } from "express";
import { searchProductsPublic } from "../controllers/products.public.controller.js";

const router = Router();

router.get("/search", searchProductsPublic);

export default router;
