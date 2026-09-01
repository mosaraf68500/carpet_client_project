"use client";

// Exposes the admin object the protected layout already verified via
// getMe(), so pages inside (protected) can read it without re-fetching.
import { createContext, useContext } from "react";

export const AdminContext = createContext(null);

export function useAdmin() {
  return useContext(AdminContext);
}
