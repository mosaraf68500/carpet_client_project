import mongoose, { type FilterQuery } from "mongoose";
import Product, { type IProduct, type ISize } from "./product.model.js";
import CategoryModel from "../category/category.model.js";
import cloudinary from "../../common/config/cloudinary.js";
import { slugify } from "../../common/utils/slugify.js";
import { HttpError } from "../../common/utils/httpError.js";
import { assertValidCloudinaryImages } from "../../common/utils/cloudinaryImage.js";
import type {
  CreateProductBody,
  UpdateProductBody,
  ProductQuery,
  AdminProductQuery,
  PaginatedResult,
} from "./product.types.js";

// Framework-agnostic business logic — no req/res here so this stays
// testable independently of Express.

export type CreateProductInput = CreateProductBody;
export type UpdateProductInput = UpdateProductBody;

const HOMEPAGE_SECTIONS = ["bestselling", "curated", "spotlight"] as const;
type HomepageSection = (typeof HOMEPAGE_SECTIONS)[number];

// Below this many characters a search query is too noisy to be useful (and
// the frontend's own debounce never sends one this short anyway) — treated
// as "no search" rather than a 400, so a direct API call with a short/empty
// `search` param just falls back to the regular listing instead of erroring.
const MIN_SEARCH_LENGTH = 2;

// Escapes regex metacharacters in raw user input before it's used to build
// a RegExp — without this, a search for e.g. "8x10 (blue)" would throw
// (unbalanced parenthesis) instead of matching literally.
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// "" / "none" (what a dashboard select sends for its default option) both
// normalize to null, same pattern as category.service.ts's
// resolveParentCategory. Anything else must be one of the 3 known values —
// validated explicitly here (rather than relying on the schema's own enum
// to reject it) so a bad value 400s with a clear message instead of a
// generic 500 from an uncaught Mongoose ValidationError.
function resolveHomepageSection(value?: string): HomepageSection | null {
  if (!value || value === "none") return null;
  if (!HOMEPAGE_SECTIONS.includes(value as HomepageSection)) {
    throw new HttpError("Invalid homepage section", 400);
  }
  return value as HomepageSection;
}

export async function getProducts(query: ProductQuery): Promise<PaginatedResult<IProduct>> {
  const { category, unit, minSize, maxSize, homepageSection, search, page = "1", limit = "12" } = query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  // Always isActive: true here regardless of what else is filtered — this
  // is the public listing, and the homepage must never show an inactive
  // product just because it happens to be tagged into a section.
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

  if (homepageSection) {
    filter.homepageSection = homepageSection;
  }

  // Case-insensitive partial match on title/description — regex rather than
  // a MongoDB $text index, since $text only matches whole (stemmed) words
  // and this is a type-as-you-go search box where "kash" must already match
  // "Kashmir" before the user finishes typing it.
  const trimmedSearch = search?.trim();
  if (trimmedSearch && trimmedSearch.length >= MIN_SEARCH_LENGTH) {
    const pattern = new RegExp(escapeRegExp(trimmedSearch), "i");
    filter.$or = [{ title: pattern }, { description: pattern }];
  }

  // Homepage-section queries sort by most-recently-updated so tagging a
  // product into a section (an update) predictably brings it to the front;
  // the regular catalog listing keeps sorting by creation order.
  const sort: Record<string, 1 | -1> = homepageSection ? { updatedAt: -1 } : { createdAt: -1 };

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
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
  const { title, description, category, sizes, homepageSection, images } = data;

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

  return Product.create({
    title,
    slug,
    description,
    category: category as unknown as mongoose.Types.ObjectId,
    sizes: sizes ?? [],
    images: assertValidCloudinaryImages(images),
    homepageSection: resolveHomepageSection(homepageSection),
  });
}

export async function updateProduct(id: string, data: UpdateProductInput): Promise<IProduct> {
  const product = await Product.findById(id);
  if (!product) {
    throw new HttpError("Product not found", 404);
  }

  const { title, description, category, sizes, isActive, homepageSection, images } = data;

  if (title) {
    product.title = title;
    product.slug = slugify(title);
  }
  if (description !== undefined) product.description = description;
  if (category) product.category = category as unknown as mongoose.Types.ObjectId;
  if (sizes) product.sizes = sizes;
  if (isActive !== undefined) product.isActive = isActive === "true" || isActive === true;
  // Distinguish "field not sent" (leave untouched) from "sent as empty
  // string/none" (explicitly clear it back to unfeatured) — same pattern
  // as category.service.ts's parentCategory handling.
  if (homepageSection !== undefined) {
    product.homepageSection = resolveHomepageSection(homepageSection);
  }

  // The dashboard always sends the full desired image list (existing ones
  // it kept + newly uploaded ones) rather than an incremental add/remove —
  // whatever public ID was on the product before but isn't in that list
  // anymore was dropped, so its Cloudinary asset gets cleaned up here.
  if (images) {
    const validated = assertValidCloudinaryImages(images);
    const keptIds = new Set(validated.map((img) => img.publicId));
    const removed = product.images.filter((img) => !keptIds.has(img.publicId));
    for (const img of removed) {
      await cloudinary.uploader.destroy(img.publicId).catch(() => {});
    }
    product.images = validated;
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
