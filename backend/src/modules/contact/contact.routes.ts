import { Router } from "express";
import {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} from "./contact.controller.js";
import { protect } from "../../common/middleware/auth.middleware.js";

const router = Router();

router.post("/", createMessage); // public — quote form submit

router.get("/", protect, getMessages);
router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteMessage);

export default router;
