import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";
import { CloudinaryStorageEngine } from "../utils/cloudinaryStorage.js";

const storage = new CloudinaryStorageEngine({ folder: "doha-furniture" });

// .single("image") for one file (category/service), .array("images", 8) for products
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and WEBP images are allowed"));
    }
    cb(null, true);
  },
});

export default upload;
