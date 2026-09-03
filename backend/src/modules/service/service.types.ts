// This is the Installation/Fixing/Delivery business resource, not to be
// confused with the *.service.ts architectural layer convention used
// across all modules.

import type { IStep } from "./service.model.js";
import type { CloudinaryImageInput } from "../../common/utils/cloudinaryImage.js";

// The dashboard uploads images straight to Cloudinary and sends back the
// resulting {url, publicId}. `image`/`contentImage` are omitted when the
// admin didn't pick a new file (leave untouched); `slideImages`, like
// product's `images`, is always sent as the full desired list.

export interface CreateServiceBody {
  title?: string;
  intro?: string;
  steps?: IStep[];
  contentTitle?: string;
  image?: CloudinaryImageInput;
  contentImage?: CloudinaryImageInput;
  slideImages?: CloudinaryImageInput[];
}

export interface UpdateServiceBody {
  title?: string;
  intro?: string;
  steps?: IStep[];
  isActive?: string | boolean;
  contentTitle?: string;
  image?: CloudinaryImageInput;
  contentImage?: CloudinaryImageInput;
  slideImages?: CloudinaryImageInput[];
}

export interface DeleteServiceResponse {
  message: string;
}
