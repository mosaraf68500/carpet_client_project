import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  getCategories as getCategoriesService,
  getCategoryBySlug as getCategoryBySlugService,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
} from "./category.service.js";
import type {
  CreateCategoryBody,
  UpdateCategoryBody,
  DeleteCategoryResponse,
} from "./category.types.js";

// @route GET /api/categories  (public)
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await getCategoriesService();
  res.json(categories);
});

// @route GET /api/categories/:slug  (public)
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await getCategoryBySlugService(req.params.slug);
  res.json(category);
});

// @route POST /api/categories  (protected)
export const createCategory = asyncHandler(
  async (req: Request<unknown, unknown, CreateCategoryBody>, res: Response) => {
    const category = await createCategoryService({ name: req.body.name, file: req.file });
    res.status(201).json(category);
  }
);

// @route PUT /api/categories/:id  (protected)
export const updateCategory = asyncHandler(
  async (req: Request<{ id: string }, unknown, UpdateCategoryBody>, res: Response) => {
    const category = await updateCategoryService(req.params.id, {
      name: req.body.name,
      file: req.file,
    });
    res.json(category);
  }
);

// @route DELETE /api/categories/:id  (protected)
export const deleteCategory = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  await deleteCategoryService(req.params.id);
  const response: DeleteCategoryResponse = { message: "Category deleted" };
  res.json(response);
});
