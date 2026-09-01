import { Router } from "express";
import { getSettings, updateSettings } from "./settings.controller.js";
import { protect } from "../../common/middleware/auth.middleware.js";

const router = Router();

router.get("/", getSettings);
router.put("/", protect, updateSettings);

export default router;
