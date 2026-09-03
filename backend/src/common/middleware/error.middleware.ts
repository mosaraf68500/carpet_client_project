import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import { HttpError } from "../utils/httpError.js";
import { MAX_FILE_SIZE_MB } from "./upload.middleware.js";

export function notFound(req: Request, res: Response, next: NextFunction): void {
  res.status(404);
  next(new Error(`Route not found — ${req.originalUrl}`));
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Mongoose bad ObjectId
  const isCastError = err.name === "CastError";
  const isMulterError = err instanceof multer.MulterError;

  // Service-layer errors carry their own status code; Multer's own errors
  // (bad upload shape — oversize file, too many files, wrong field name)
  // otherwise landed here as a plain Error and fell through to a generic
  // 500, which read as a server crash rather than a validation problem.
  // Otherwise fall back to whatever a controller already set via
  // res.status() before throwing, or 500 if nothing set it.
  const statusCode = isCastError
    ? 404
    : err instanceof HttpError
      ? err.statusCode
      : isMulterError
        ? (err as multer.MulterError).code === "LIMIT_FILE_SIZE"
          ? 413
          : 400
        : res.statusCode && res.statusCode !== 200
          ? res.statusCode
          : 500;

  const message = isCastError
    ? "Resource not found"
    : isMulterError && (err as multer.MulterError).code === "LIMIT_FILE_SIZE"
      ? `Image size must be under ${MAX_FILE_SIZE_MB}MB`
      : err.message;

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}
