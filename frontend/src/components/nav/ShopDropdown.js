"use client";

// Same hover-dropdown pattern, panel styling, and sizing as ServicesDropdown
// — a plain vertical text-link list, same background/padding/spacing/hover
// state, same centered-under-trigger positioning. The only real differences
// from ServicesDropdown: the trigger is a real link to /shop (a working
// "all products" page, not just a dropdown toggle — clicking it must always
// navigate there, hover/focus is what opens the panel), and its links come
// from nav.megaMenu.columns (top-level categories) instead of the
// hardcoded services list.
import Link from "next/link";
import { useRef, useState } from "react";

export default function ShopDropdown({ label, href, links }) {
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
      <Link
        href={href}
        aria-haspopup="true"
        aria-expanded={open}
        onFocus={openNow}
        className="flex items-center gap-1 hover:text-primary"
      >
        {label}
        <span aria-hidden="true" className="text-xs">
          ▾
        </span>
      </Link>

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
