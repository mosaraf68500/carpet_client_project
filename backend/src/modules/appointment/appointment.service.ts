import Appointment, { type IAppointment, type AppointmentStatus } from "./appointment.model.js";
import { HttpError } from "../../common/utils/httpError.js";
import type {
  CreateAppointmentBody,
  CreateAppointmentResponse,
  AppointmentQuery,
  AppointmentsResult,
} from "./appointment.types.js";

// Framework-agnostic business logic — no req/res here so this stays
// testable independently of Express.

const VALID_STATUSES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];

export async function createAppointment(data: CreateAppointmentBody): Promise<CreateAppointmentResponse> {
  const { name, contact, preferredDate, message } = data;

  if (!name || !contact || !preferredDate) {
    throw new HttpError("Name, contact, and preferred date are required", 400);
  }

  const parsedDate = new Date(preferredDate);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new HttpError("Preferred date is invalid", 400);
  }

  const doc = await Appointment.create({
    name,
    contact,
    preferredDate: parsedDate,
    message,
  });

  return { message: "Appointment request received", id: doc._id.toString() };
}

export async function getAppointments(query: AppointmentQuery): Promise<AppointmentsResult<IAppointment>> {
  const { page = "1", limit = "20" } = query;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const [items, total] = await Promise.all([
    Appointment.find()
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Appointment.countDocuments(),
  ]);

  return {
    items,
    total,
    page: pageNum,
    totalPages: Math.max(1, Math.ceil(total / limitNum)),
  };
}

export async function updateStatus(id: string, status: string | undefined): Promise<IAppointment> {
  if (!status || !VALID_STATUSES.includes(status as AppointmentStatus)) {
    throw new HttpError(`Status must be one of: ${VALID_STATUSES.join(", ")}`, 400);
  }

  const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
  if (!appointment) {
    throw new HttpError("Appointment not found", 404);
  }
  return appointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new HttpError("Appointment not found", 404);
  }
  await appointment.deleteOne();
}
