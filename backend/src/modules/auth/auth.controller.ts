import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { authenticateAdmin } from "./auth.service.js";
import type { LoginRequestBody, MeResponse } from "./auth.types.js";

// @route POST /api/auth/login
export const login = asyncHandler(
  async (req: Request<unknown, unknown, LoginRequestBody>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const result = await authenticateAdmin(email, password);

    if (!result) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json(result);
  }
);

// @route GET /api/auth/me  (lets the dashboard verify a stored token on load)
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const admin = req.admin;

  if (!admin) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const response: MeResponse = { id: admin._id.toString(), email: admin.email };
  res.json(response);
});
