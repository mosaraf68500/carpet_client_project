import type { Request } from "express";
import type { StorageEngine } from "multer";
import cloudinary from "../config/cloudinary.js";

interface CloudinaryStorageOptions {
  folder: string;
}

// Worst case (every attempt fails) is roughly
// MAX_UPLOAD_ATTEMPTS * PER_ATTEMPT_TIMEOUT_MS + retry delays.
const MAX_UPLOAD_ATTEMPTS = 2;
// Profiled directly against this environment: a raw authenticated upload to
// Cloudinary via curl (bypassing Node entirely) completes in ~2-3s even for
// a several-MB file, so 20s per attempt is already generous headroom, not a
// tight cap.
//
// This is OUR OWN timeout, enforced independently of the Cloudinary SDK's
// `timeout` option — that option is unreliable on the Node version this
// backend runs on: `cloudinary.uploader.upload_stream()`'s internal
// `request.setTimeout(ms, () => request.abort())` was measured (via an
// isolated script using only the SDK, no Express/multer/our code involved)
// to take on the order of DOUBLE the configured timeout to actually
// surface an error — a 60s configured timeout took ~121s per attempt in
// practice, so two retries cost ~4 minutes for what should be a few-second
// upload. Racing our own timer against the upload promise means a client
// never waits anywhere near that long, regardless of what the SDK's own
// (slow, likely `.abort()`-related — deprecated since Node 14 — internals)
// eventually do in the background.
const PER_ATTEMPT_TIMEOUT_MS = 20000;
const RETRY_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

// Buffers the incoming file fully into memory (multer's own fileFilter/
// limits caps this, so that's safe) so a failed upload attempt can retry
// from the same bytes — the original request stream can only be piped/
// consumed once, so a Buffer is what makes retrying possible.
//
// Rejects immediately on multer's own 'limit' event (fired on this same
// stream when limits.fileSize is exceeded) instead of waiting for 'end' —
// without this, an oversized file would buffer to completion and this
// engine would then spend up to ~2 minutes (MAX_UPLOAD_ATTEMPTS retries at
// PER_ATTEMPT_TIMEOUT_MS each) trying to upload the truncated bytes to
// Cloudinary before multer's real "file too large" error ever reaches the
// client — multer discards whatever this callback produces once it's
// already aborting, so there's nothing to gain by finishing that upload
// attempt, only ~2 minutes to lose.
function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("limit", () => reject(new Error("File exceeds the configured size limit")));
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

  // Serializes every Cloudinary upload through this engine, across every
  // request, so only one is ever in flight at a time. Measured directly:
  // firing 2-3 uploads to Cloudinary concurrently from this Node process
  // reliably makes some of them hang and hit PER_ATTEMPT_TIMEOUT_MS on
  // attempt 1 (occasionally on attempt 2 as well, failing the whole
  // request) — the exact same underlying issue as the single-upload
  // timeout above, just triggered by concurrency instead of chance.
  // Sequential uploads from a single admin dashboard never queue deep
  // enough for this to cost anything noticeable, and it sidesteps the bug
  // entirely rather than paying for retries to recover from it.
  private static uploadChain: Promise<void> = Promise.resolve();

  constructor({ folder }: CloudinaryStorageOptions) {
    this.folder = folder;
  }

  private uploadBuffer(buffer: Buffer): Promise<{ path: string; filename: string; size: number }> {
    const uploadPromise = new Promise<{ path: string; filename: string; size: number }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.folder,
          resource_type: "image",
          transformation: [{ width: 1600, crop: "limit" }],
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Cloudinary upload returned no result"));
          resolve({ path: result.secure_url, filename: result.public_id, size: result.bytes });
        }
      );
      uploadStream.end(buffer);
    });

    // See PER_ATTEMPT_TIMEOUT_MS above for why this doesn't just pass
    // `timeout` to the SDK instead.
    return withTimeout(uploadPromise, PER_ATTEMPT_TIMEOUT_MS, "Cloudinary upload timed out");
  }

  async _handleFile(
    _req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void
  ): Promise<void> {
    let buffer: Buffer;
    try {
      buffer = await streamToBuffer(file.stream);
    } catch (err) {
      return callback(err);
    }

    // Queued so this file's upload (and its retries) only starts once
    // every earlier-queued upload — from this request or any other — has
    // finished. See the class-level comment on uploadChain for why.
    const runUpload = async (): Promise<{ path: string; filename: string; size: number }> => {
      let lastError: unknown;
      for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
        try {
          return await this.uploadBuffer(buffer);
        } catch (err) {
          lastError = err;
          if (attempt < MAX_UPLOAD_ATTEMPTS) await sleep(RETRY_DELAY_MS);
        }
      }
      throw lastError;
    };

    const queued = CloudinaryStorageEngine.uploadChain.then(runUpload, runUpload);
    CloudinaryStorageEngine.uploadChain = queued.then(
      () => undefined,
      () => undefined
    );

    try {
      callback(null, await queued);
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
