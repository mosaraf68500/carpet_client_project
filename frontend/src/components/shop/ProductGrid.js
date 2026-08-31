"use client";

import { useState } from "react";
import ProductCard from "@/components/common/ProductCard";
import Toolbar from "./Toolbar";
import { shopProductsPage1, shopProductsPage2, loadMoreLabel } from "@/data/shopContent";

export default function ProductGrid() {
  const [products, setProducts] = useState(shopProductsPage1);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);

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

  return (
    <div className="flex-1">
      <Toolbar shownCount={products.length} />

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} align="left" />
        ))}
      </div>

      {!exhausted && (
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
    </div>
  );
}
