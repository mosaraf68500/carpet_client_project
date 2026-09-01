import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  getAllProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller.js";
import { protect } from "../../common/middleware/auth.middleware.js";
import upload from "../../common/middleware/upload.middleware.js";

const router = Router();

router.get("/", getProducts);
router.get("/admin/all", protect, getAllProductsForAdmin); // must come before "/:slug"
router.get("/:slug", getProductBySlug);

router.post("/", protect, upload.array("images", 8), createProduct);
router.put("/:id", protect, upload.array("images", 8), updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
