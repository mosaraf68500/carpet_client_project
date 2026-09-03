import { Router } from "express";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";
import { protect } from "../../common/middleware/auth.middleware.js";

const router = Router();

router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);

router.post("/", protect, createCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
