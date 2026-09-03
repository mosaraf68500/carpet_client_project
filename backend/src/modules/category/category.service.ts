import type { Types } from "mongoose";
import Category, { type ICategory } from "./category.model.js";
import ProductModel from "../product/product.model.js";
import cloudinary from "../../common/config/cloudinary.js";
import { slugify } from "../../common/utils/slugify.js";
import { HttpError } from "../../common/utils/httpError.js";
import type { CategoryQuery } from "./category.types.js";

// Framework-agnostic business logic — no req/res here so this stays
// testable independently of Express.

export interface CreateCategoryInput {
  name?: string;
  file?: Express.Multer.File;
  parentCategory?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  file?: Express.Multer.File;
  parentCategory?: string;
}

// Shared by create/update: resolves the "parentCategory" form field (a
// string id, or empty/undefined for "no parent") into either null or a
// validated top-level category's ObjectId. Checked here — at the service
// layer — rather than trusting the dashboard/frontend to only ever offer
// valid parents, since this is the one place every caller goes through.
async function resolveParentCategory(parentCategoryId?: string): Promise<Types.ObjectId | null> {
  if (!parentCategoryId) return null;

  const parent = await Category.findById(parentCategoryId);
  if (!parent) {
    throw new HttpError("Selected parent category does not exist", 400);
  }
  if (parent.parentCategory) {
    throw new HttpError(
      "Cannot create a subcategory under another subcategory — max 2 levels supported",
      400
    );
  }
  return parent._id as Types.ObjectId;
}

export async function getCategories(query: CategoryQuery = {}): Promise<ICategory[]> {
  const { parent } = query;

  if (parent === undefined) {
    return Category.find().sort({ name: 1 });
  }
  if (parent === "null" || parent === "root") {
    return Category.find({ parentCategory: null }).sort({ name: 1 });
  }
  return Category.find({ parentCategory: parent }).sort({ name: 1 });
}

export async function getCategoryBySlug(slug: string): Promise<ICategory> {
  const category = await Category.findOne({ slug }).populate("parentCategory", "name slug");
  if (!category) {
    throw new HttpError("Category not found", 404);
  }
  return category;
}

export async function createCategory(data: CreateCategoryInput): Promise<ICategory> {
  const { name, file, parentCategory } = data;

  if (!name) {
    throw new HttpError("Category name is required", 400);
  }

  const slug = slugify(name);
  const exists = await Category.findOne({ slug });
  if (exists) {
    throw new HttpError("A category with this name already exists", 400);
  }

  const resolvedParent = await resolveParentCategory(parentCategory);

  return Category.create({
    name,
    slug,
    image: file ? { url: file.path, publicId: file.filename } : undefined,
    parentCategory: resolvedParent,
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

  // Distinguish "field not sent" (leave parent untouched) from "sent as
  // empty string" (explicitly clear the parent) — unlike `name`, an empty
  // parentCategory is a meaningful, valid value (top-level).
  if (data.parentCategory !== undefined) {
    if (data.parentCategory && data.parentCategory === id) {
      throw new HttpError("A category cannot be its own parent", 400);
    }
    category.parentCategory = await resolveParentCategory(data.parentCategory);
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
