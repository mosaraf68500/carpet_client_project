import mongoose, { Schema, type Document, type Model } from "mongoose";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface IAppointment extends Document {
  name: string;
  contact: string; // phone or email — the frontend form uses one free-text field for either
  preferredDate: Date;
  message: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    preferredDate: { type: Date, required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Appointment: Model<IAppointment> = mongoose.model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;
