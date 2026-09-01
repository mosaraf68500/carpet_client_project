"use client";

// Shares the checked "Size in feet" / "Size in cm" filters between
// FilterSidebar (where they're checked) and ProductGrid (where they filter
// results) without lifting state into the shop page.js (a Server Component)
// or making either component's whole subtree depend on the other directly.
import { createContext, useContext, useState, useCallback } from "react";

const ShopFiltersContext = createContext(null);

export function ShopFiltersProvider({ children }) {
  const [sizeFt, setSizeFt] = useState(() => new Set());
  const [sizeCm, setSizeCm] = useState(() => new Set());

  const toggleSizeFt = useCallback((label) => {
    setSizeFt((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }, []);

  const toggleSizeCm = useCallback((label) => {
    setSizeCm((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }, []);

  const value = { sizeFt, sizeCm, toggleSizeFt, toggleSizeCm };

  return <ShopFiltersContext.Provider value={value}>{children}</ShopFiltersContext.Provider>;
}

export function useShopFilters() {
  const ctx = useContext(ShopFiltersContext);
  if (!ctx) throw new Error("useShopFilters must be used within ShopFiltersProvider");
  return ctx;
}
