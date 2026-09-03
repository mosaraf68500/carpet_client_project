import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface ICategoryImage {
  url: string;
  publicId: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: ICategoryImage;
  // null = top-level category. Non-null must point at a category whose own
  // parentCategory is null — enforced in category.service.ts, not here, so
  // it applies consistently regardless of caller (max 2 levels deep).
  parentCategory: Types.ObjectId | null;
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
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

categorySchema.index({ parentCategory: 1 });

const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
