import jwt from "jsonwebtoken";

export function generateToken(adminId: string): string {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
}
