import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  phone: string;
  email: string;
  message: string;
  product: Types.ObjectId | null; // optional reference to the product the quote was requested for
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, default: "" },
    product: { type: Schema.Types.ObjectId, ref: "Product", default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ContactMessage: Model<IContactMessage> = mongoose.model<IContactMessage>(
  "ContactMessage",
  contactMessageSchema
);

export default ContactMessage;
