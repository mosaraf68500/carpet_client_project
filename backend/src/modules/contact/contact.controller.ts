import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  createMessage as createMessageService,
  getMessages as getMessagesService,
  markAsRead as markAsReadService,
  deleteMessage as deleteMessageService,
} from "./contact.service.js";
import type { CreateMessageBody, MessageQuery, DeleteMessageResponse } from "./contact.types.js";

// @route POST /api/contact  (public — the frontend's Free Quote form)
export const createMessage = asyncHandler(
  async (req: Request<unknown, unknown, CreateMessageBody>, res: Response) => {
    const result = await createMessageService(req.body);
    res.status(201).json(result);
  }
);

// @route GET /api/contact  (protected)
export const getMessages = asyncHandler(
  async (req: Request<unknown, unknown, unknown, MessageQuery>, res: Response) => {
    const result = await getMessagesService(req.query);
    res.json(result);
  }
);

// @route PATCH /api/contact/:id/read  (protected)
export const markAsRead = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const msg = await markAsReadService(req.params.id);
  res.json(msg);
});

// @route DELETE /api/contact/:id  (protected)
export const deleteMessage = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  await deleteMessageService(req.params.id);
  const response: DeleteMessageResponse = { message: "Message deleted" };
  res.json(response);
});
