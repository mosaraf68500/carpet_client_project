// This is the Installation/Fixing/Delivery business resource, not to be
// confused with the *.service.ts architectural layer convention used
// across all modules.

import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IStep {
  title: string;
  description: string;
}

export interface IServiceImage {
  url: string;
  publicId: string;
}

export interface IService extends Document {
  title: string;
  slug: string;
  intro: string;
  steps: IStep[];
  image: IServiceImage;
  // contentTitle/contentImage back the page's 2nd section (heading +
  // description + a related photo, side by side) — separate from `title`
  // (used for the hero overlay) and `image` (the hero banner), so a page
  // like the reference design can show different text/photo in each spot.
  contentTitle: string;
  contentImage: IServiceImage;
  // A slideshow gallery shown above "Our Promise" on the service page —
  // separate from the single hero/content images since this is a growing
  // multi-image collection, not one replaceable photo.
  slideImages: IServiceImage[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const stepSchema = new Schema<IStep>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const serviceImageSchema = new Schema<IServiceImage>(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    intro: { type: String, default: "" }, // short intro paragraph
    steps: { type: [stepSchema], default: [] }, // the alternating "how it works" rows
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    contentTitle: { type: String, default: "" },
    contentImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    slideImages: { type: [serviceImageSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service: Model<IService> = mongoose.model<IService>("Service", serviceSchema);

export default Service;
