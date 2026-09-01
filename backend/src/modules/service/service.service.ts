// This is the Installation/Fixing/Delivery business resource, not to be
// confused with the *.service.ts architectural layer convention used
// across all modules — this file IS that layer, for that resource.

import ServiceModel, { type IService, type IStep, type IServiceImage } from "./service.model.js";
import cloudinary from "../../common/config/cloudinary.js";
import { slugify } from "../../common/utils/slugify.js";
import { HttpError } from "../../common/utils/httpError.js";
import type { CreateServiceBody, UpdateServiceBody } from "./service.types.js";

// Framework-agnostic business logic — no req/res here so this stays
// testable independently of Express.

export interface CreateServiceInput extends CreateServiceBody {
  file?: Express.Multer.File;
}

export interface UpdateServiceInput extends UpdateServiceBody {
  file?: Express.Multer.File;
}

export async function getServices(): Promise<IService[]> {
  return ServiceModel.find({ isActive: true }).sort({ title: 1 });
}

export async function getServiceBySlug(slug: string): Promise<IService> {
  const service = await ServiceModel.findOne({ slug, isActive: true });
  if (!service) {
    throw new HttpError("Service not found", 404);
  }
  return service;
}

export async function getAllServicesForAdmin(): Promise<IService[]> {
  return ServiceModel.find().sort({ title: 1 });
}

export async function createService(data: CreateServiceInput): Promise<IService> {
  const { title, intro, steps, file } = data;

  if (!title) {
    throw new HttpError("Title is required", 400);
  }

  const slug = slugify(title);
  const exists = await ServiceModel.findOne({ slug });
  if (exists) {
    throw new HttpError("A service with this title already exists", 400);
  }

  const image: IServiceImage | undefined = file
    ? { url: file.path, publicId: file.filename }
    : undefined;

  return ServiceModel.create({
    title,
    slug,
    intro,
    steps: steps ? (JSON.parse(steps) as IStep[]) : [],
    image,
  });
}

export async function updateService(id: string, data: UpdateServiceInput): Promise<IService> {
  const service = await ServiceModel.findById(id);
  if (!service) {
    throw new HttpError("Service not found", 404);
  }

  const { title, intro, steps, isActive, file } = data;

  if (title) {
    service.title = title;
    service.slug = slugify(title);
  }
  if (intro !== undefined) service.intro = intro;
  if (steps) service.steps = JSON.parse(steps) as IStep[];
  if (isActive !== undefined) service.isActive = isActive === "true" || isActive === true;

  if (file) {
    if (service.image?.publicId) {
      await cloudinary.uploader.destroy(service.image.publicId).catch(() => {});
    }
    service.image = { url: file.path, publicId: file.filename };
  }

  await service.save();
  return service;
}

export async function deleteService(id: string): Promise<void> {
  const service = await ServiceModel.findById(id);
  if (!service) {
    throw new HttpError("Service not found", 404);
  }

  if (service.image?.publicId) {
    await cloudinary.uploader.destroy(service.image.publicId).catch(() => {});
  }

  await service.deleteOne();
}
