import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  createAppointment as createAppointmentService,
  getAppointments as getAppointmentsService,
  updateStatus as updateStatusService,
  deleteAppointment as deleteAppointmentService,
} from "./appointment.service.js";
import type {
  CreateAppointmentBody,
  AppointmentQuery,
  UpdateAppointmentStatusBody,
  DeleteAppointmentResponse,
} from "./appointment.types.js";

// @route POST /api/appointments  (public — the frontend's Book an Appointment form)
export const createAppointment = asyncHandler(
  async (req: Request<unknown, unknown, CreateAppointmentBody>, res: Response) => {
    const result = await createAppointmentService(req.body);
    res.status(201).json(result);
  }
);

// @route GET /api/appointments  (protected)
export const getAppointments = asyncHandler(
  async (req: Request<unknown, unknown, unknown, AppointmentQuery>, res: Response) => {
    const result = await getAppointmentsService(req.query);
    res.json(result);
  }
);

// @route PATCH /api/appointments/:id  (protected)
export const updateAppointmentStatus = asyncHandler(
  async (req: Request<{ id: string }, unknown, UpdateAppointmentStatusBody>, res: Response) => {
    const appointment = await updateStatusService(req.params.id, req.body.status);
    res.json(appointment);
  }
);

// @route DELETE /api/appointments/:id  (protected)
export const deleteAppointment = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  await deleteAppointmentService(req.params.id);
  const response: DeleteAppointmentResponse = { message: "Appointment deleted" };
  res.json(response);
});
