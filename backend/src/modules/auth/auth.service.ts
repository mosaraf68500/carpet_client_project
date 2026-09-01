import Admin from "./auth.model.js";
import { generateToken } from "../../common/utils/generateToken.js";
import type { LoginResponse } from "./auth.types.js";

// Framework-agnostic business logic — no req/res here so this stays
// testable independently of Express.

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<LoginResponse | null> {
  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin || !(await admin.matchPassword(password))) {
    return null;
  }

  return {
    token: generateToken(admin._id.toString()),
    admin: { id: admin._id.toString(), email: admin.email },
  };
}
