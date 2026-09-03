import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError.js";

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

  // Service-layer errors carry their own status code. Otherwise fall back
  // to whatever a controller already set via res.status() before
  // throwing, or 500 if nothing set it.
  const statusCode = isCastError
    ? 404
    : err instanceof HttpError
      ? err.statusCode
      : res.statusCode && res.statusCode !== 200
        ? res.statusCode
        : 500;

  // A known error (CastError, or an HttpError thrown deliberately by a
  // service/controller) always carries a safe, user-facing message.
  // Anything else reached this handler unexpectedly, so its raw message
  // may contain internals (DB/SMTP/Cloudinary error text, file paths)
  // that shouldn't be echoed back to the client in production — log it
  // server-side and return a generic message instead.
  const isKnownError = isCastError || err instanceof HttpError;
  const isProduction = process.env.NODE_ENV === "production";

  if (!isKnownError && isProduction) {
    console.error(err);
  }

  const message = isCastError
    ? "Resource not found"
    : !isKnownError && isProduction
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({
    message,
    stack: isProduction ? undefined : err.stack,
  });
}
