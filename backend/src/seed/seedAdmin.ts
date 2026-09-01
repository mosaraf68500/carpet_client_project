import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../common/config/db.js";
import Admin from "../modules/auth/auth.model.js";

async function seedAdmin(): Promise<void> {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.");
    process.exit(1);
  }

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin already exists for ${email} — skipping.`);
    process.exit(0);
  }

  await Admin.create({ email, password }); // password is hashed by the pre-save hook
  console.log(`Admin created: ${email}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  mongoose.disconnect();
  process.exit(1);
});
