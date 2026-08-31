"use client";

import Link from "next/link";
import { useState } from "react";
import { useUI } from "./UIProvider";
import { nav } from "@/data/siteContent";
import {
  CloseIcon,
  HomeIcon,
  ShopIcon,
  WishlistIcon,
  CartIcon,
  SearchIcon,
} from "@/components/common/Icons";

export default function MobileMenu() {
  const { open, openPanel, closePanel } = useUI();
  const isOpen = !!open.mobileMenu;
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => closePanel("mobileMenu")} />
        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-xs flex-col bg-white transition-transform duration-300 ${
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

          <div className="mt-auto flex flex-col gap-3 p-6">
            <button
              type="button"
              onClick={() => openPanel("login")}
              className="border border-black py-3 text-sm uppercase tracking-wide"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => openPanel("register")}
              className="border border-black py-3 text-sm uppercase tracking-wide"
            >
              Register
            </button>
          </div>
        </div>
      </div>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-white py-3 lg:hidden"
      >
        <Link href="/" aria-label="Home" className="text-black">
          <HomeIcon />
        </Link>
        <Link href="/shop/" aria-label="Shop" className="text-black">
          <ShopIcon />
        </Link>
        <Link href="/wishlist/" aria-label="Wishlist" className="relative text-black">
          <WishlistIcon />
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
            0
          </span>
        </Link>
        <button
          type="button"
          aria-label="Cart"
          onClick={() => openPanel("cart")}
          className="relative text-black"
        >
          <CartIcon />
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
            0
          </span>
        </button>
        <button type="button" aria-label="Search" onClick={() => openPanel("search")} className="text-black">
          <SearchIcon />
        </button>
      </nav>
    </>
  );
}
