import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISettings extends Document {
  phone: string;
  landline: string;
  whatsapp: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    phone: { type: String, default: "" },
    landline: { type: String, default: "" },
    whatsapp: { type: String, default: "" }, // digits only, for wa.me links
    email: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

// Enforces a single Settings document — always fetch/update the one with this fixed id.
export const SETTINGS_SINGLETON_ID = "000000000000000000000001";

const Settings: Model<ISettings> = mongoose.model<ISettings>("Settings", settingsSchema);

export default Settings;
