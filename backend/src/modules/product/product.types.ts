import type { ISize } from "./product.model.js";
import type { CloudinaryImageInput } from "../../common/utils/cloudinaryImage.js";

// The dashboard uploads images straight to Cloudinary and sends back the
// full desired `images` array (kept existing ones + newly uploaded ones,
// in the order they should appear) — the service layer diffs it against
// what's currently saved to know which Cloudinary assets were dropped.

export interface CreateProductBody {
  title?: string;
  description?: string;
  category?: string;
  sizes?: ISize[];
  homepageSection?: string;
  images?: CloudinaryImageInput[];
}

export interface UpdateProductBody {
  title?: string;
  description?: string;
  category?: string;
  sizes?: ISize[];
  isActive?: string | boolean;
  homepageSection?: string;
  images?: CloudinaryImageInput[];
}

// Query params always arrive as strings (or are absent) regardless of the
// value's logical type — Express doesn't coerce them.
export interface ProductQuery {
  category?: string;
  unit?: string;
  minSize?: string;
  maxSize?: string;
  homepageSection?: string;
  search?: string;
  page?: string;
  limit?: string;
}

export interface AdminProductQuery {
  page?: string;
  limit?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DeleteProductResponse {
  message: string;
}
