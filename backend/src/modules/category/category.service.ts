import Category, { type ICategory } from "./category.model.js";
import ProductModel from "../product/product.model.js";
import cloudinary from "../../common/config/cloudinary.js";
import { slugify } from "../../common/utils/slugify.js";
import { HttpError } from "../../common/utils/httpError.js";

// Framework-agnostic business logic — no req/res here so this stays
// testable independently of Express.

export interface CreateCategoryInput {
  name?: string;
  file?: Express.Multer.File;
}

export interface UpdateCategoryInput {
  name?: string;
  file?: Express.Multer.File;
}

export async function getCategories(): Promise<ICategory[]> {
  return Category.find().sort({ name: 1 });
}

export async function getCategoryBySlug(slug: string): Promise<ICategory> {
  const category = await Category.findOne({ slug });
  if (!category) {
    throw new HttpError("Category not found", 404);
  }
  return category;
}

export async function createCategory(data: CreateCategoryInput): Promise<ICategory> {
  const { name, file } = data;

  if (!name) {
    throw new HttpError("Category name is required", 400);
  }

  const slug = slugify(name);
  const exists = await Category.findOne({ slug });
  if (exists) {
    throw new HttpError("A category with this name already exists", 400);
  }

  return Category.create({
    name,
    slug,
    image: file ? { url: file.path, publicId: file.filename } : undefined,
  });
}

export async function updateCategory(id: string, data: UpdateCategoryInput): Promise<ICategory> {
  const category = await Category.findById(id);
  if (!category) {
    throw new HttpError("Category not found", 404);
  }

  if (data.name) {
    category.name = data.name;
    category.slug = slugify(data.name);
  }

  if (data.file) {
    // remove the old Cloudinary asset before attaching the new one
    if (category.image?.publicId) {
      await cloudinary.uploader.destroy(category.image.publicId).catch(() => {});
    }
    category.image = { url: data.file.path, publicId: data.file.filename };
  }

  await category.save();
  return category;
}

export async function deleteCategory(id: string): Promise<void> {
  const category = await Category.findById(id);
  if (!category) {
    throw new HttpError("Category not found", 404);
  }

  const productCount = await ProductModel.countDocuments({ category: category._id });
  if (productCount > 0) {
    throw new HttpError(
      `Cannot delete — ${productCount} product(s) still use this category. Reassign or delete them first.`,
      400
    );
  }

  if (category.image?.publicId) {
    await cloudinary.uploader.destroy(category.image.publicId).catch(() => {});
  }

  await category.deleteOne();
}
