import mongoose, { type FilterQuery } from "mongoose";
import Product, { type IProduct, type ISize, type IProductImage } from "./product.model.js";
import CategoryModel from "../category/category.model.js";
import cloudinary from "../../common/config/cloudinary.js";
import { slugify } from "../../common/utils/slugify.js";
import { HttpError } from "../../common/utils/httpError.js";
import type {
  CreateProductBody,
  UpdateProductBody,
  ProductQuery,
  AdminProductQuery,
  PaginatedResult,
} from "./product.types.js";

// Framework-agnostic business logic — no req/res here so this stays
// testable independently of Express.

export interface CreateProductInput extends CreateProductBody {
  files?: Express.Multer.File[];
}

export interface UpdateProductInput extends UpdateProductBody {
  files?: Express.Multer.File[];
}

export async function getProducts(query: ProductQuery): Promise<PaginatedResult<IProduct>> {
  const { category, unit, minSize, maxSize, page = "1", limit = "12" } = query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const filter: FilterQuery<IProduct> = { isActive: true };

  if (category) {
    const cat = await CategoryModel.findOne({ slug: category });
    if (!cat) {
      return { items: [], total: 0, page: pageNum, totalPages: 1 };
    }
    filter.category = cat._id as mongoose.Types.ObjectId;
  }

  if (unit || minSize || maxSize) {
    const sizeMatch: FilterQuery<ISize> = {};
    if (unit) sizeMatch.unit = unit;
    if (minSize || maxSize) {
      const valueMatch: Record<string, number> = {};
      if (minSize) valueMatch.$gte = Number(minSize);
      if (maxSize) valueMatch.$lte = Number(maxSize);
      sizeMatch.value = valueMatch;
    }
    filter.sizes = { $elemMatch: sizeMatch };
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: pageNum,
    totalPages: Math.max(1, Math.ceil(total / limitNum)),
  };
}

export async function getProductBySlug(slug: string): Promise<IProduct> {
  const product = await Product.findOne({ slug, isActive: true }).populate(
    "category",
    "name slug"
  );
  if (!product) {
    throw new HttpError("Product not found", 404);
  }
  return product;
}

export async function getAllProductsForAdmin(
  query: AdminProductQuery
): Promise<PaginatedResult<IProduct>> {
  const { page = "1", limit = "20" } = query;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const [items, total] = await Promise.all([
    Product.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(),
  ]);

  return { items, total, page: pageNum, totalPages: Math.max(1, Math.ceil(total / limitNum)) };
}

export async function createProduct(data: CreateProductInput): Promise<IProduct> {
  const { title, description, category, sizes, files } = data;

  if (!title || !category) {
    throw new HttpError("Title and category are required", 400);
  }

  const categoryDoc = await CategoryModel.findById(category);
  if (!categoryDoc) {
    throw new HttpError("Selected category does not exist", 400);
  }

  const slug = slugify(title);
  const exists = await Product.findOne({ slug });
  if (exists) {
    throw new HttpError("A product with this title already exists", 400);
  }

  const images: IProductImage[] = (files ?? []).map((f) => ({
    url: f.path,
    publicId: f.filename,
  }));

  return Product.create({
    title,
    slug,
    description,
    category: category as unknown as mongoose.Types.ObjectId,
    sizes: sizes ? (JSON.parse(sizes) as ISize[]) : [],
    images,
  });
}

export async function updateProduct(id: string, data: UpdateProductInput): Promise<IProduct> {
  const product = await Product.findById(id);
  if (!product) {
    throw new HttpError("Product not found", 404);
  }

  const { title, description, category, sizes, isActive, removeImagePublicIds, files } = data;

  if (title) {
    product.title = title;
    product.slug = slugify(title);
  }
  if (description !== undefined) product.description = description;
  if (category) product.category = category as unknown as mongoose.Types.ObjectId;
  if (sizes) product.sizes = JSON.parse(sizes) as ISize[];
  if (isActive !== undefined) product.isActive = isActive === "true" || isActive === true;

  // remove selected existing images
  if (removeImagePublicIds) {
    const idsToRemove: string[] = JSON.parse(removeImagePublicIds);
    for (const publicId of idsToRemove) {
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
    product.images = product.images.filter((img) => !idsToRemove.includes(img.publicId));
  }

  // append newly uploaded images
  if (files?.length) {
    const newImages: IProductImage[] = files.map((f) => ({ url: f.path, publicId: f.filename }));
    product.images.push(...newImages);
  }

  await product.save();
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const product = await Product.findById(id);
  if (!product) {
    throw new HttpError("Product not found", 404);
  }

  for (const img of product.images) {
    await cloudinary.uploader.destroy(img.publicId).catch(() => {});
  }

  await product.deleteOne();
}
