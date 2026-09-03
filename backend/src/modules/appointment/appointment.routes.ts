import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "./appointment.controller.js";
import { protect } from "../../common/middleware/auth.middleware.js";

const router = Router();

router.post("/", createAppointment); // public — book-an-appointment form submit

router.get("/", protect, getAppointments);
router.patch("/:id", protect, updateAppointmentStatus);
router.delete("/:id", protect, deleteAppointment);

export default router;
