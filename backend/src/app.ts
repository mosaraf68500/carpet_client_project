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

// All six modules (auth, category, product, service, contact, settings)
// have been migrated to TypeScript; the legacy JS backend (config/,
// models/, controllers/, routes/, middleware/, utils/, seed/, server.js)
// has been deleted.

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.DASHBOARD_URL].filter(
      (origin): origin is string => Boolean(origin)
    ),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) =>
  res.json({ status: "ok", service: "doha-furniture-backend" })
);
app.get("/health", (_req: Request, res: Response) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
