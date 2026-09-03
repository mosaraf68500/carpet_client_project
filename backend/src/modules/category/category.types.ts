// The image itself comes from `req.file` (multipart upload), never the
// JSON body, so these DTOs only ever carry `name` (+ parentCategory).

export interface CreateCategoryBody {
  name?: string;
  // Arrives as a string ObjectId or empty string from form data — empty
  // string is treated as "no parent" (top-level) in the service layer.
  parentCategory?: string;
}

export interface UpdateCategoryBody {
  name?: string;
  parentCategory?: string;
}

export interface DeleteCategoryResponse {
  message: string;
}

// `parent` on the list endpoint: absent = return everything flat;
// "null"/"root" = top-level categories only; anything else = children of
// that category id.
export interface CategoryQuery {
  parent?: string;
}
