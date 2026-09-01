import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  getProducts as getProductsService,
  getProductBySlug as getProductBySlugService,
  getAllProductsForAdmin as getAllProductsForAdminService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "./product.service.js";
import type {
  CreateProductBody,
  UpdateProductBody,
  ProductQuery,
  AdminProductQuery,
  DeleteProductResponse,
} from "./product.types.js";

// @route GET /api/products?category=slug&unit=ft&minSize=4&maxSize=8&page=1&limit=12
// (public)
export const getProducts = asyncHandler(
  async (req: Request<unknown, unknown, unknown, ProductQuery>, res: Response) => {
    const result = await getProductsService(req.query);
    res.json(result);
  }
);

// @route GET /api/products/:slug  (public)
export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await getProductBySlugService(req.params.slug);
  res.json(product);
});

// @route GET /api/products/admin/all  (protected — dashboard sees inactive ones too)
export const getAllProductsForAdmin = asyncHandler(
  async (req: Request<unknown, unknown, unknown, AdminProductQuery>, res: Response) => {
    const result = await getAllProductsForAdminService(req.query);
    res.json(result);
  }
);

// @route POST /api/products  (protected)
export const createProduct = asyncHandler(
  async (req: Request<unknown, unknown, CreateProductBody>, res: Response) => {
    const product = await createProductService({
      ...req.body,
      files: req.files as Express.Multer.File[] | undefined,
    });
    res.status(201).json(product);
  }
);

// @route PUT /api/products/:id  (protected)
export const updateProduct = asyncHandler(
  async (req: Request<{ id: string }, unknown, UpdateProductBody>, res: Response) => {
    const product = await updateProductService(req.params.id, {
      ...req.body,
      files: req.files as Express.Multer.File[] | undefined,
    });
    res.json(product);
  }
);

// @route DELETE /api/products/:id  (protected)
export const deleteProduct = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  await deleteProductService(req.params.id);
  const response: DeleteProductResponse = { message: "Product deleted" };
  res.json(response);
});
