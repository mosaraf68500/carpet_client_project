import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import type { Request, Response, NextFunction } from "express";
import Admin from "../../modules/auth/auth.model.js";

interface JwtPayload {
  id: string;
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    // Attach the admin (minus password) so controllers can use req.admin if ever needed
    req.admin = (await Admin.findById(decoded.id).select("-password")) ?? undefined;
    if (!req.admin) {
      res.status(401);
      throw new Error("Not authorized — admin no longer exists");
    }
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized — invalid or expired token");
  }
});
