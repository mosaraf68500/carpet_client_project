import { HttpError } from "./httpError.js";

export interface CloudinaryImageInput {
  url?: string;
  publicId?: string;
}

export interface CloudinaryImage {
  url: string;
  publicId: string;
}

// The dashboard now uploads straight from the browser to Cloudinary (see
// ImageUpload/cloudinaryUpload.js) and only sends back the resulting URL —
// this guards against a malformed or arbitrary (non-Cloudinary) URL being
// saved as if it were one of our own uploaded assets, since nothing on the
// server ever fetches or verifies the file at that URL otherwise.
const urlPrefix = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`;
const publicIdPattern = /^[A-Za-z0-9_\-./]+$/;

export function assertValidCloudinaryImage(image: CloudinaryImageInput): CloudinaryImage {
  if (!image.url || !image.url.startsWith(urlPrefix)) {
    throw new HttpError("Image URL must be a Cloudinary asset from this account", 400);
  }
  if (!image.publicId || image.publicId.includes("..") || !publicIdPattern.test(image.publicId)) {
    throw new HttpError("Invalid image reference", 400);
  }
  return { url: image.url, publicId: image.publicId };
}

export function assertValidCloudinaryImages(images: CloudinaryImageInput[] = []): CloudinaryImage[] {
  return images.map(assertValidCloudinaryImage);
}
