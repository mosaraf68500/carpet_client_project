import type { Request } from "express";
import type { StorageEngine } from "multer";
import cloudinary from "../config/cloudinary.js";

interface CloudinaryStorageOptions {
  folder: string;
}

// Worst case (every attempt fails) is roughly
// MAX_UPLOAD_ATTEMPTS * PER_ATTEMPT_TIMEOUT_MS + retry delays — kept under
// ~2 minutes total so a genuinely failing upload still errors out in a
// reasonable time instead of leaving the dashboard hanging for minutes.
const MAX_UPLOAD_ATTEMPTS = 2;
const PER_ATTEMPT_TIMEOUT_MS = 60000;
const RETRY_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Buffers the incoming file fully into memory (multer's own fileFilter/
// limits already cap this at 5MB, so that's safe) so a failed upload
// attempt can retry from the same bytes — the original request stream can
// only be piped/consumed once, so a Buffer is what makes retrying possible.
function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

/**
 * Minimal multer StorageEngine that streams the uploaded file straight to
 * Cloudinary. Replaces `multer-storage-cloudinary`, which only supports
 * Cloudinary SDK v1 and conflicts with the v2 SDK we use here.
 *
 * Retries a few times on failure (with a short delay between attempts) —
 * this environment's outbound connection to Cloudinary is often slow/flaky
 * enough that a single attempt regularly times out or gets a transient 502,
 * even though the same upload usually succeeds on a retry.
 */
export class CloudinaryStorageEngine implements StorageEngine {
  private folder: string;

  constructor({ folder }: CloudinaryStorageOptions) {
    this.folder = folder;
  }

  private uploadBuffer(buffer: Buffer): Promise<{ path: string; filename: string; size: number }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.folder,
          resource_type: "image",
          transformation: [{ width: 1600, crop: "limit" }],
          timeout: PER_ATTEMPT_TIMEOUT_MS,
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Cloudinary upload returned no result"));
          resolve({ path: result.secure_url, filename: result.public_id, size: result.bytes });
        }
      );
      uploadStream.end(buffer);
    });
  }

  async _handleFile(
    _req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void
  ): Promise<void> {
    try {
      const buffer = await streamToBuffer(file.stream);

      let lastError: unknown;
      for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
        try {
          const result = await this.uploadBuffer(buffer);
          return callback(null, result);
        } catch (err) {
          lastError = err;
          if (attempt < MAX_UPLOAD_ATTEMPTS) await sleep(RETRY_DELAY_MS);
        }
      }
      callback(lastError);
    } catch (err) {
      callback(err);
    }
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
