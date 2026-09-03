// This is the Installation/Fixing/Delivery business resource, not to be
// confused with the *.service.ts architectural layer convention used
// across all modules — this file IS that layer, for that resource.

import ServiceModel, { type IService } from "./service.model.js";
import cloudinary from "../../common/config/cloudinary.js";
import { slugify } from "../../common/utils/slugify.js";
import { HttpError } from "../../common/utils/httpError.js";
import { assertValidCloudinaryImage, assertValidCloudinaryImages } from "../../common/utils/cloudinaryImage.js";
import type { CreateServiceBody, UpdateServiceBody } from "./service.types.js";

// Framework-agnostic business logic — no req/res here so this stays
// testable independently of Express.

export type CreateServiceInput = CreateServiceBody;
export type UpdateServiceInput = UpdateServiceBody;

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
  const { title, intro, steps, contentTitle, image, contentImage, slideImages } = data;

  if (!title) {
    throw new HttpError("Title is required", 400);
  }

  const slug = slugify(title);
  const exists = await ServiceModel.findOne({ slug });
  if (exists) {
    throw new HttpError("A service with this title already exists", 400);
  }

  return ServiceModel.create({
    title,
    slug,
    intro,
    steps: steps ?? [],
    image: image ? assertValidCloudinaryImage(image) : undefined,
    contentTitle,
    contentImage: contentImage ? assertValidCloudinaryImage(contentImage) : undefined,
    slideImages: assertValidCloudinaryImages(slideImages),
  });
}

export async function updateService(id: string, data: UpdateServiceInput): Promise<IService> {
  const service = await ServiceModel.findById(id);
  if (!service) {
    throw new HttpError("Service not found", 404);
  }

  const { title, intro, steps, isActive, contentTitle, image, contentImage, slideImages } = data;

  if (title) {
    service.title = title;
    service.slug = slugify(title);
  }
  if (intro !== undefined) service.intro = intro;
  if (steps) service.steps = steps;
  if (contentTitle !== undefined) service.contentTitle = contentTitle;
  if (isActive !== undefined) service.isActive = isActive === "true" || isActive === true;

  if (image) {
    const validated = assertValidCloudinaryImage(image);
    if (service.image?.publicId && service.image.publicId !== validated.publicId) {
      await cloudinary.uploader.destroy(service.image.publicId).catch(() => {});
    }
    service.image = validated;
  }

  if (contentImage) {
    const validated = assertValidCloudinaryImage(contentImage);
    if (service.contentImage?.publicId && service.contentImage.publicId !== validated.publicId) {
      await cloudinary.uploader.destroy(service.contentImage.publicId).catch(() => {});
    }
    service.contentImage = validated;
  }

  // slideImages is a growing collection, not one replaceable photo — the
  // dashboard always sends the full desired list (kept + newly uploaded),
  // same "diff against what's currently saved" pattern as
  // product.service.ts's images handling.
  if (slideImages) {
    const validated = assertValidCloudinaryImages(slideImages);
    const keptIds = new Set(validated.map((img) => img.publicId));
    const removed = service.slideImages.filter((img) => !keptIds.has(img.publicId));
    for (const img of removed) {
      await cloudinary.uploader.destroy(img.publicId).catch(() => {});
    }
    service.slideImages = validated;
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
  if (service.contentImage?.publicId) {
    await cloudinary.uploader.destroy(service.contentImage.publicId).catch(() => {});
  }
  for (const slide of service.slideImages) {
    if (slide.publicId) {
      await cloudinary.uploader.destroy(slide.publicId).catch(() => {});
    }
  }

  await service.deleteOne();
}
