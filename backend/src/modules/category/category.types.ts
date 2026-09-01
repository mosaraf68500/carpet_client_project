// The image itself comes from `req.file` (multipart upload), never the
// JSON body, so these DTOs only ever carry `name`.

export interface CreateCategoryBody {
  name?: string;
}

export interface UpdateCategoryBody {
  name?: string;
}

export interface DeleteCategoryResponse {
  message: string;
}
