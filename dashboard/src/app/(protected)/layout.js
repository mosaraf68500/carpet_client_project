"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/lib/auth";
import { getMe } from "@/lib/api";
import { AdminContext } from "@/lib/adminContext";
import Sidebar from "@/components/layout/Sidebar";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState("checking"); // "checking" | "authenticated"
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const me = await getMe();
        if (cancelled) return;
        setAdmin(me);
        setStatus("authenticated");
      } catch {
        if (cancelled) return;
        clearToken();
        router.replace("/login");
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-body">Loading…</p>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={admin}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1 bg-box-grey pt-14 md:pt-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
        </main>
      </div>
    </AdminContext.Provider>
  );
}
