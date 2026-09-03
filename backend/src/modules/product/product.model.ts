import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface ISize {
  value: number;
  unit: "ft" | "cm";
}

export interface IProductImage {
  url: string;
  publicId: string;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  category: Types.ObjectId;
  sizes: ISize[];
  images: IProductImage[];
  isActive: boolean; // lets dashboard hide a product without deleting it
  homepageSection: "bestselling" | "curated" | "spotlight" | null;
  createdAt: Date;
  updatedAt: Date;
}

const sizeSchema = new Schema<ISize>(
  {
    value: { type: Number, required: true },
    unit: { type: String, enum: ["ft", "cm"], required: true },
  },
  { _id: false }
);

const imageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    sizes: { type: [sizeSchema], default: [] },
    images: { type: [imageSchema], default: [] },
    isActive: { type: Boolean, default: true },
    homepageSection: {
      type: String,
      enum: ["bestselling", "curated", "spotlight", null],
      default: null,
    },
  },
  { timestamps: true }
);

// Supports category + size filtering from the Shop page in one query
productSchema.index({ category: 1, isActive: 1 });
// Supports the homepage's per-section product queries
productSchema.index({ homepageSection: 1, isActive: 1 });

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);

export default Product;
