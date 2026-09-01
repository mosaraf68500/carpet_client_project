import ContactMessage, { type IContactMessage } from "./contact.model.js";
import ProductModel from "../product/product.model.js";
import { sendQuoteNotification } from "../../common/utils/sendEmail.js";
import { HttpError } from "../../common/utils/httpError.js";
import type {
  CreateMessageBody,
  CreateMessageResponse,
  MessageQuery,
  MessagesResult,
} from "./contact.types.js";

// Framework-agnostic business logic — no req/res here so this stays
// testable independently of Express.

export async function createMessage(data: CreateMessageBody): Promise<CreateMessageResponse> {
  const { name, phone, email, message, productId } = data;

  if (!name || !phone || !email) {
    throw new HttpError("Name, phone, and email are required", 400);
  }

  let product = null;
  let productTitle: string | undefined;
  if (productId) {
    product = await ProductModel.findById(productId).select("title");
    productTitle = product?.title;
  }

  const doc = await ContactMessage.create({
    name,
    phone,
    email,
    message,
    product: product?._id || null,
  });

  // fire-and-forget — a slow/broken SMTP server should never block the user's submission
  sendQuoteNotification({ name, phone, email, message, productTitle });

  return { message: "Quote request received", id: doc._id.toString() };
}

export async function getMessages(query: MessageQuery): Promise<MessagesResult<IContactMessage>> {
  const { page = "1", limit = "20", unreadOnly } = query;
  const filter = unreadOnly === "true" ? { isRead: false } : {};

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const [items, total, unreadCount] = await Promise.all([
    ContactMessage.find(filter)
      .populate("product", "title slug")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    ContactMessage.countDocuments(filter),
    ContactMessage.countDocuments({ isRead: false }),
  ]);

  return {
    items,
    total,
    unreadCount,
    page: pageNum,
    totalPages: Math.max(1, Math.ceil(total / limitNum)),
  };
}

export async function markAsRead(id: string): Promise<IContactMessage> {
  const msg = await ContactMessage.findByIdAndUpdate(id, { isRead: true }, { new: true });
  if (!msg) {
    throw new HttpError("Message not found", 404);
  }
  return msg;
}

export async function deleteMessage(id: string): Promise<void> {
  const msg = await ContactMessage.findById(id);
  if (!msg) {
    throw new HttpError("Message not found", 404);
  }
  await msg.deleteOne();
}
