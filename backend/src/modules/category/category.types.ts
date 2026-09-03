import type { CloudinaryImageInput } from "../../common/utils/cloudinaryImage.js";

// The dashboard uploads the image straight to Cloudinary and sends back
// only the resulting {url, publicId} — `image` is omitted entirely when
// the admin didn't pick a new file, which the service layer reads as
// "leave the existing image untouched".

export interface CreateCategoryBody {
  name?: string;
  // Arrives as a string ObjectId or empty string — empty string is
  // treated as "no parent" (top-level) in the service layer.
  parentCategory?: string;
  image?: CloudinaryImageInput;
}

export interface UpdateCategoryBody {
  name?: string;
  parentCategory?: string;
  image?: CloudinaryImageInput;
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
