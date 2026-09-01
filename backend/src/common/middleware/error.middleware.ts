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

  // Service-layer errors carry their own status code; otherwise fall back
  // to whatever a controller already set via res.status() before throwing,
  // or 500 if nothing set it.
  const statusCode = isCastError
    ? 404
    : err instanceof HttpError
      ? err.statusCode
      : res.statusCode && res.statusCode !== 200
        ? res.statusCode
        : 500;

  res.status(statusCode).json({
    message: isCastError ? "Resource not found" : err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}
