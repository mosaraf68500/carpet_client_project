"use client";

// The only interactive slice of the header: mobile hamburger, login/search/
// cart triggers, and the currency switcher — all need useUI() or local
// state. Isolated here so Navbar itself can stay a Server Component.
import { useState } from "react";
import { useUI } from "@/components/layout/UIProvider";
import { currencySwitcher } from "@/data/siteContent";
import { HamburgerIcon, UserIcon, SearchIcon, CartIcon } from "@/components/common/Icons";

export function MobileMenuToggle() {
  const { openPanel } = useUI();
  return (
    <button
      type="button"
      aria-label="Toggle mobile menu"
      onClick={() => openPanel("mobileMenu")}
      className="text-black hover:text-primary"
    >
      <HamburgerIcon />
    </button>
  );
}

export default function NavControls() {
  const { openPanel } = useUI();
  const [currency, setCurrency] = useState(currencySwitcher.current);
  const cartCount = 0;

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        aria-label="Log in"
        onClick={() => openPanel("login")}
        className="hidden text-black hover:text-primary lg:block"
      >
        <UserIcon />
      </button>
      <button
        type="button"
        aria-label="Search"
        onClick={() => openPanel("search")}
        className="text-black hover:text-primary"
      >
        <SearchIcon />
      </button>
      <button
        type="button"
        aria-label="Cart"
        onClick={() => openPanel("cart")}
        className="relative text-black hover:text-primary"
      >
        <CartIcon />
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
          {cartCount}
        </span>
      </button>

      <div className="hidden text-sm md:block">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          aria-label="Currency"
          className="cursor-pointer bg-transparent"
        >
          {currencySwitcher.options.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
