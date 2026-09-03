// `sizes` and `removeImagePublicIds` arrive as JSON strings from the
// multipart form (the actual image files come from `req.files`, never the
// body), so both stay typed as `string` here and get JSON.parse()'d in
// the service layer.

export interface CreateProductBody {
  title?: string;
  description?: string;
  category?: string;
  sizes?: string;
  homepageSection?: string;
}

export interface UpdateProductBody {
  title?: string;
  description?: string;
  category?: string;
  sizes?: string;
  isActive?: string | boolean;
  removeImagePublicIds?: string;
  homepageSection?: string;
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
