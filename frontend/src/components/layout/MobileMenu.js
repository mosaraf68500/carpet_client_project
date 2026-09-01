"use client";

import Link from "next/link";
import { useState } from "react";
import { useUI } from "./UIProvider";
import { nav } from "@/data/siteContent";
import SearchField from "@/components/nav/SearchField";
import { CloseIcon } from "@/components/common/Icons";

// Mobile collapses to logo + hamburger in the Navbar; this slide-in panel is
// where the search field and nav links actually live on small screens (no
// separate bottom icon bar, no login/cart — those were removed from the
// header redesign entirely).
export default function MobileMenu() {
  const { open, closePanel } = useUI();
  const isOpen = !!open.mobileMenu;
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-black/50" onClick={() => closePanel("mobileMenu")} />
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-5">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => closePanel("mobileMenu")}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-6 pb-4">
          <SearchField id="mobile-search" />
        </div>

        <ul className="flex flex-col gap-1 px-6 font-nav text-lg">
          {nav.primary.map((item) =>
            item.isServicesDropdown ? (
              <li key={item.label} className="border-b border-border py-3">
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  onClick={() => setServicesOpen((v) => !v)}
                  className="flex w-full items-center justify-between"
                >
                  {item.label}
                  <span aria-hidden="true" className="text-sm">
                    {servicesOpen ? "−" : "+"}
                  </span>
                </button>
                {servicesOpen && (
                  <ul className="mt-3 flex flex-col gap-3 pl-4 text-base text-body">
                    {nav.megaMenu.services.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} onClick={() => closePanel("mobileMenu")}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={item.href} className="border-b border-border py-3">
                <Link href={item.href} onClick={() => closePanel("mobileMenu")}>
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
