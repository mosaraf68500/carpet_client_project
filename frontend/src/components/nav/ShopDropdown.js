"use client";

// Same hover-dropdown pattern, panel styling, and sizing as ServicesDropdown
// — a plain vertical list, same background/padding/spacing/hover state,
// same centered-under-trigger positioning. The only real differences from
// ServicesDropdown: the trigger is a real link to /shop (a working "all
// products" page, not just a dropdown toggle — clicking it must always
// navigate there, hover/focus is what opens the panel), and its content is
// now a real category tree (top-level categories as headings, their
// subcategories as indented links beneath) fetched by the parent Server
// Component (Navbar) and passed down as `tree`, instead of the old flat
// hardcoded nav.megaMenu.columns list.
import Link from "next/link";
import { useRef, useState } from "react";

export default function ShopDropdown({ label, href, tree }) {
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
        {tree.map((top) => (
          <div key={top._id}>
            <Link
              href={`/product-category/${top.slug}/`}
              role="menuitem"
              className="text-sm font-semibold text-black hover:text-primary"
            >
              {top.name}
            </Link>
            {top.children.length > 0 && (
              <div className="mt-2 flex flex-col gap-2 pl-3">
                {top.children.map((child) => (
                  <Link
                    key={child._id}
                    href={`/product-category/${child.slug}/`}
                    role="menuitem"
                    className="text-sm text-black/70 hover:text-primary"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
