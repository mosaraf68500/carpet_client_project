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
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service: Model<IService> = mongoose.model<IService>("Service", serviceSchema);

export default Service;
