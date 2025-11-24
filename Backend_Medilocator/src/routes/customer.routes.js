import { Router } from "express";
import { getAllMedicinesAcrossStores } from "../controllers/customer.controllers.js";

const router = Router();

// Public route - no authentication required
router.get("/all-medicines", getAllMedicinesAcrossStores);

export default router;