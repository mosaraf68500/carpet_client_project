import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  getSettings as getSettingsService,
  updateSettings as updateSettingsService,
} from "./settings.service.js";
import type { UpdateSettingsBody } from "./settings.types.js";

// @route GET /api/settings  (public — frontend footer/nav/quote page read this)
export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getSettingsService();
  res.json(settings);
});

// @route PUT /api/settings  (protected)
export const updateSettings = asyncHandler(
  async (req: Request<unknown, unknown, UpdateSettingsBody>, res: Response) => {
    const settings = await updateSettingsService(req.body);
    res.json(settings);
  }
);
