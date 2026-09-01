import type { Request } from "express";
import type { StorageEngine } from "multer";
import cloudinary from "../config/cloudinary.js";

interface CloudinaryStorageOptions {
  folder: string;
}

/**
 * Minimal multer StorageEngine that streams the uploaded file straight to
 * Cloudinary. Replaces `multer-storage-cloudinary`, which only supports
 * Cloudinary SDK v1 and conflicts with the v2 SDK we use here.
 */
export class CloudinaryStorageEngine implements StorageEngine {
  private folder: string;

  constructor({ folder }: CloudinaryStorageOptions) {
    this.folder = folder;
  }

  _handleFile(
    _req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void
  ): void {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: this.folder,
        resource_type: "image",
        transformation: [{ width: 1600, crop: "limit" }],
      },
      (error, result) => {
        if (error || !result) return callback(error);
        callback(null, {
          path: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
        });
      }
    );
    file.stream.pipe(uploadStream);
  }

  _removeFile(
    _req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null) => void
  ): void {
    cloudinary.uploader
      .destroy(file.filename)
      .then(() => callback(null))
      .catch(callback);
  }
}

export default CloudinaryStorageEngine;
