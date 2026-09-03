"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Wrench,
  MessageSquare,
  CalendarCheck,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { clearToken } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/categories", label: "Categories", icon: FolderTree },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/appointments", label: "Appointments", icon: CalendarCheck },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile top bar — hidden on md+, where the sidebar is always visible */}
      <div className="fixed inset-x-0 top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-white px-4 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="text-heading"
        >
          <Menu size={22} />
        </button>
        <p className="text-sm font-semibold text-heading">Doha Carpet Admin</p>
        <span className="w-[22px]" aria-hidden="true" />
      </div>

      {/* Overlay behind the mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-sidebar text-white transition-transform duration-300 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-8">
          <div>
            <p className="text-lg font-semibold tracking-wide">Doha Carpet</p>
            <p className="text-xs uppercase tracking-widest text-white/50">Admin</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-white/70 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xs px-3 py-2.5 text-sm transition-colors duration-200 ${
                      isActive ? "bg-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 py-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xs px-3 py-2.5 text-sm text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
