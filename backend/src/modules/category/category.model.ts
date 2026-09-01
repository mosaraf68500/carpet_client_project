import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICategoryImage {
  url: string;
  publicId: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: ICategoryImage;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }, // Cloudinary public_id, needed to delete the asset later
    },
  },
  { timestamps: true }
);

const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
