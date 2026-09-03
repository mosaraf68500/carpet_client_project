import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";
import { CloudinaryStorageEngine } from "../utils/cloudinaryStorage.js";

// NOTE: 26 pre-existing images still live under the old "doha-furniture/"
// Cloudinary folder from before the rename to Doha Carpet — they were left
// in place (not moved/renamed) since that would break their existing URLs.
// Only new uploads go to the new folder below.
const storage = new CloudinaryStorageEngine({ folder: "doha-carpet" });

// Product/category/service photos rarely need to exceed this — past it,
// admins should compress the image before uploading rather than the
// backend accepting arbitrarily large files (cost and DoS-surface reasons
// both argue against no cap). Exported so error.middleware.ts can quote the
// same number back in its "file too large" message instead of a second
// hardcoded copy drifting out of sync with this one.
export const MAX_FILE_SIZE_MB = 8;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// .single("image") for one file (category/service), .array("images", 8) for products
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and WEBP images are allowed"));
    }
    cb(null, true);
  },
});

export default upload;
