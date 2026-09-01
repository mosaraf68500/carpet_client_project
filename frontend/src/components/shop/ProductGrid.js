"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/common/ProductCard";
import Toolbar from "./Toolbar";
import { useShopFilters } from "./ShopFiltersProvider";
import {
  shopProductsPage1,
  shopProductsPage2,
  sizeFtFilter,
  sizeCmFilter,
  getSizeTierIndex,
  loadMoreLabel,
} from "@/data/shopContent";

const allProducts = [...shopProductsPage1, ...shopProductsPage2];

export default function ProductGrid() {
  const [products, setProducts] = useState(shopProductsPage1);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const { sizeFt, sizeCm } = useShopFilters();

  const handleLoadMore = () => {
    if (exhausted) return;
    setLoading(true);
    // No real backend yet — mimics the original "Load more" AJAX pagination
    // by appending the next page of mock data after a short delay.
    setTimeout(() => {
      setProducts((prev) => [...prev, ...shopProductsPage2]);
      setExhausted(true);
      setLoading(false);
    }, 400);
  };

  // "Size in feet" and "Size in cm" are the same 10 size tiers in two units
  // (see getSizeTierIndex), so a checked box in either list resolves to the
  // same tier index and the two sets are combined with OR, not AND.
  const selectedTierIndexes = useMemo(() => {
    const indexes = new Set();
    sizeFt.forEach((label) => indexes.add(sizeFtFilter.findIndex((t) => t.label === label)));
    sizeCm.forEach((label) => indexes.add(sizeCmFilter.findIndex((t) => t.label === label)));
    return indexes;
  }, [sizeFt, sizeCm]);

  const hasSizeFilter = selectedTierIndexes.size > 0;
  // A filtered view shows every match from the full catalog at once — the
  // "Load more" two-page split only makes sense for the default, unfiltered
  // browse order.
  const visibleProducts = hasSizeFilter
    ? allProducts.filter((product) => selectedTierIndexes.has(getSizeTierIndex(product.size)))
    : products;

  return (
    <div className="flex-1">
      <Toolbar shownCount={visibleProducts.length} />

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
        {visibleProducts.map((product) => (
          <ProductCard key={product.slug} product={product} align="left" />
        ))}
      </div>

      {!hasSizeFilter && !exhausted && (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            className="border border-black px-8 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white disabled:opacity-50"
          >
            {loading ? "Loading…" : loadMoreLabel}
          </button>
        </div>
      )}

      {hasSizeFilter && visibleProducts.length === 0 && (
        <p className="mt-14 text-center text-body">No products match the selected size.</p>
      )}
    </div>
  );
}
