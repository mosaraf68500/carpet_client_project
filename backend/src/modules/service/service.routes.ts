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
import upload from "../../common/middleware/upload.middleware.js";

const router = Router();

router.get("/", getServices);
router.get("/admin/all", protect, getAllServicesForAdmin); // must come before "/:slug"
router.get("/:slug", getServiceBySlug);

// "image" = hero banner, "contentImage" = the 2nd section's related photo,
// "slideImages" = the multi-image slideshow shown above "Our Promise" —
// independent file fields, so .fields() replaces .single()/.array(). No
// real cap on how many slides a service can have (the client wants
// "as many as they want"); multer still needs a concrete number, so this
// is set high enough to be effectively unlimited for a real editor rather
// than an actual intended limit.
const serviceImageUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "contentImage", maxCount: 1 },
  { name: "slideImages", maxCount: 50 },
]);

router.post("/", protect, serviceImageUpload, createService);
router.put("/:id", protect, serviceImageUpload, updateService);
router.delete("/:id", protect, deleteService);

export default router;
