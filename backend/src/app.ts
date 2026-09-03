import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";

import { notFound, errorHandler } from "./common/middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import productRoutes from "./modules/product/product.routes.js";
// `serviceRoutes` here means the Installation/Fixing/Delivery resource's
// router — same "Routes" suffix as the other modules above, not to be
// confused with the *.service.ts architectural layer inside that module.
import serviceRoutes from "./modules/service/service.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
import appointmentRoutes from "./modules/appointment/appointment.routes.js";

// All modules (auth, category, product, service, contact, settings,
// appointment) are TypeScript; the legacy JS backend (config/, models/,
// controllers/, routes/, middleware/, utils/, seed/, server.js) has been
// deleted.

const app = express();

// Allowed origins come from env vars so production domains are configured
// per-deploy (e.g. Vercel dashboard) without touching code. ALLOWED_ORIGINS
// takes a comma-separated list for any number of production domains;
// CLIENT_URL/DASHBOARD_URL stay supported for backward compatibility. In
// development, localhost is always allowed even if no env var is set.
const envOrigins = [
  process.env.CLIENT_URL,
  process.env.DASHBOARD_URL,
  ...(process.env.ALLOWED_ORIGINS?.split(",") ?? []),
]
  .map((origin) => origin?.trim())
  .filter((origin): origin is string => Boolean(origin));

const devOrigins =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:3000", "http://localhost:3001"]
    : [];

const allowedOrigins = Array.from(new Set([...envOrigins, ...devOrigins]));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) =>
  res.json({ status: "ok", service: "doha-carpet-backend" })
);
app.get("/health", (_req: Request, res: Response) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
