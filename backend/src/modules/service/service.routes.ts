// This is the Installation/Fixing/Delivery business resource, not to be
// confused with the *.service.ts architectural layer convention used
// across all modules.

import { Router } from "express";
import {
  getServices,
  getServiceBySlug,
  getAllServicesForAdmin,
  createService,
  updateService,
  deleteService,
} from "./service.controller.js";
import { protect } from "../../common/middleware/auth.middleware.js";

const router = Router();

router.get("/", getServices);
router.get("/admin/all", protect, getAllServicesForAdmin); // must come before "/:slug"
router.get("/:slug", getServiceBySlug);

router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

export default router;
