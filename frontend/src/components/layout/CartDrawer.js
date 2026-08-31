"use client";

import Link from "next/link";
import { useUI } from "./UIProvider";
import { cartDrawer } from "@/data/siteContent";

// No real cart logic yet — this preserves the drawer's open/close UI and layout
// only. Wire up real cart state (items, totals) later.
export default function CartDrawer() {
  const { open, closePanel } = useUI();
  const isOpen = !!open.cart;
  const items = [];

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-black/50" onClick={() => closePanel("cart")} />
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h3 className="font-heading text-lg">{cartDrawer.title}</h3>
          <button
            type="button"
            aria-label="Close Cart"
            onClick={() => closePanel("cart")}
            className="text-xl leading-none hover:text-primary"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <p className="text-sm text-body">{cartDrawer.emptyMessage}</p>
          ) : null}
        </div>

        <div className="border-t border-border px-6 py-5">
          <div className="flex items-center gap-6 text-sm text-body">
            <button type="button" className="hover:text-black">
              {cartDrawer.noteLabel}
            </button>
            <button type="button" className="hover:text-black">
              {cartDrawer.couponLabel}
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span>{cartDrawer.subtotalLabel}</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between">
              <span>{cartDrawer.taxLabel}</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>{cartDrawer.totalLabel}</span>
              <span>₹0</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/checkout/"
              className="bg-black py-3 text-center text-sm uppercase tracking-wide text-white hover:bg-primary"
            >
              {cartDrawer.checkoutLabel}
            </Link>
            <Link
              href="/cart/"
              className="border-b border-black pb-1 text-center text-sm uppercase tracking-wide"
            >
              {cartDrawer.viewCartLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
