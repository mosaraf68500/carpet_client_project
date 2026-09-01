import type { IAdmin } from "../../modules/auth/auth.model.js";

// Augments Express's Request type so `req.admin` (set by the `protect`
// middleware) is typed everywhere instead of requiring an `any` cast.
declare global {
  namespace Express {
    interface Request {
      admin?: IAdmin;
    }
  }
}

export {};
