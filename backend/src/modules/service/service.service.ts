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
  image?: Express.Multer.File;
  contentImage?: Express.Multer.File;
  slideImages?: Express.Multer.File[];
}

export interface UpdateServiceInput extends UpdateServiceBody {
  image?: Express.Multer.File;
  contentImage?: Express.Multer.File;
  slideImages?: Express.Multer.File[];
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
  const { title, intro, steps, contentTitle, image, contentImage, slideImages } = data;

  if (!title) {
    throw new HttpError("Title is required", 400);
  }

  const slug = slugify(title);
  const exists = await ServiceModel.findOne({ slug });
  if (exists) {
    throw new HttpError("A service with this title already exists", 400);
  }

  const heroImage: IServiceImage | undefined = image
    ? { url: image.path, publicId: image.filename }
    : undefined;
  const sectionImage: IServiceImage | undefined = contentImage
    ? { url: contentImage.path, publicId: contentImage.filename }
    : undefined;
  const slides: IServiceImage[] = (slideImages ?? []).map((f) => ({
    url: f.path,
    publicId: f.filename,
  }));

  return ServiceModel.create({
    title,
    slug,
    intro,
    steps: steps ? (JSON.parse(steps) as IStep[]) : [],
    image: heroImage,
    contentTitle,
    contentImage: sectionImage,
    slideImages: slides,
  });
}

export async function updateService(id: string, data: UpdateServiceInput): Promise<IService> {
  const service = await ServiceModel.findById(id);
  if (!service) {
    throw new HttpError("Service not found", 404);
  }

  const { title, intro, steps, isActive, contentTitle, image, contentImage, slideImages, removeSlideImagePublicIds } =
    data;

  if (title) {
    service.title = title;
    service.slug = slugify(title);
  }
  if (intro !== undefined) service.intro = intro;
  if (steps) service.steps = JSON.parse(steps) as IStep[];
  if (contentTitle !== undefined) service.contentTitle = contentTitle;
  if (isActive !== undefined) service.isActive = isActive === "true" || isActive === true;

  if (image) {
    if (service.image?.publicId) {
      await cloudinary.uploader.destroy(service.image.publicId).catch(() => {});
    }
    service.image = { url: image.path, publicId: image.filename };
  }

  if (contentImage) {
    if (service.contentImage?.publicId) {
      await cloudinary.uploader.destroy(service.contentImage.publicId).catch(() => {});
    }
    service.contentImage = { url: contentImage.path, publicId: contentImage.filename };
  }

  // slideImages is a growing collection, not one replaceable photo — remove
  // selected existing slides, then append newly uploaded ones, same pattern
  // as product.service.ts's images/removeImagePublicIds handling.
  if (removeSlideImagePublicIds) {
    const idsToRemove: string[] = JSON.parse(removeSlideImagePublicIds);
    for (const publicId of idsToRemove) {
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
    service.slideImages = service.slideImages.filter((img) => !idsToRemove.includes(img.publicId));
  }
  if (slideImages?.length) {
    const newSlides: IServiceImage[] = slideImages.map((f) => ({ url: f.path, publicId: f.filename }));
    service.slideImages.push(...newSlides);
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
