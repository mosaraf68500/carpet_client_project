// This is the Installation/Fixing/Delivery business resource, not to be
// confused with the *.service.ts architectural layer convention used
// across all modules.
//
// Naming note: the business-logic layer is imported as a namespace
// (`* as serviceLogic`) rather than individual named imports here,
// specifically so nothing in this file ends up named e.g.
// `getServices as getServicesService` — doubling "Service" would be
// exactly the resource/layer collision this module is trying to avoid.

import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as serviceLogic from "./service.service.js";
import type {
  CreateServiceBody,
  UpdateServiceBody,
  DeleteServiceResponse,
} from "./service.types.js";

// @route GET /api/services  (public)
export const getServices = asyncHandler(async (_req: Request, res: Response) => {
  const services = await serviceLogic.getServices();
  res.json(services);
});

// @route GET /api/services/:slug  (public)
export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const service = await serviceLogic.getServiceBySlug(req.params.slug);
  res.json(service);
});

// @route GET /api/services/admin/all  (protected)
export const getAllServicesForAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const services = await serviceLogic.getAllServicesForAdmin();
  res.json(services);
});

// upload.fields([...]) puts req.files as { [fieldname]: File[] } rather
// than the single File | File[] shapes .single()/.array() produce.
type ServiceFilesMap = Record<"image" | "contentImage" | "slideImages", Express.Multer.File[] | undefined>;

function pickServiceFiles(req: {
  files?: unknown;
}): { image?: Express.Multer.File; contentImage?: Express.Multer.File; slideImages?: Express.Multer.File[] } {
  const files = req.files as ServiceFilesMap | undefined;
  return {
    image: files?.image?.[0],
    contentImage: files?.contentImage?.[0],
    slideImages: files?.slideImages,
  };
}

// @route POST /api/services  (protected)
export const createService = asyncHandler(
  async (req: Request<unknown, unknown, CreateServiceBody>, res: Response) => {
    const service = await serviceLogic.createService({ ...req.body, ...pickServiceFiles(req) });
    res.status(201).json(service);
  }
);

// @route PUT /api/services/:id  (protected)
export const updateService = asyncHandler(
  async (req: Request<{ id: string }, unknown, UpdateServiceBody>, res: Response) => {
    const service = await serviceLogic.updateService(req.params.id, {
      ...req.body,
      ...pickServiceFiles(req),
    });
    res.json(service);
  }
);

// @route DELETE /api/services/:id  (protected)
export const deleteService = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  await serviceLogic.deleteService(req.params.id);
  const response: DeleteServiceResponse = { message: "Service deleted" };
  res.json(response);
});
