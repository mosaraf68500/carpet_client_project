"use client";

// TODO: replace with real design once client provides it. Built from
// reference-html/services-dropdown-navbar.html, which is itself a rough
// screenshot reconstruction (not real markup) — same hover-dropdown pattern
// as the "Shop" mega menu, cream/beige panel background.
//
// Kept as its own small client component (rather than making the whole
// Navbar a client component) so only this island ships open/close JS.
import Link from "next/link";
import { useRef, useState } from "react";

export default function ServicesDropdown({ label, links }) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef(null);

  const openNow = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };

  const closeSoon = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 100);
  };

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 hover:text-primary"
      >
        {label}
        <span aria-hidden="true" className="text-xs">
          ▾
        </span>
      </button>

      <div
        role="menu"
        aria-label={label}
        className={`absolute left-1/2 top-full z-50 min-w-55 -translate-x-1/2 flex-col gap-4 bg-cream-dark px-8 py-6 shadow-lg ${
          open ? "flex" : "hidden"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            role="menuitem"
            className="text-sm text-black hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
