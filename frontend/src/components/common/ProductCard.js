"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ product, onAddToCart, align = "center" }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [compared, setCompared] = useState(false);
  const href = `/product/${product.slug}/`;
  // Homepage spotlight passes an explicit primaryCta; the shop grid derives it
  // from priceOnRequest — a product only gets a real "Add to cart" once it has a price.
  const showAddToCart = product.primaryCta
    ? product.primaryCta === "Add to cart"
    : !product.priceOnRequest;

  return (
    <div
      className={`group relative flex flex-col ${align === "left" ? "text-left" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-box-grey">
        <Link href={href}>
          <Image
            src={hovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        </Link>

        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={() => setWishlisted((v) => !v)}
            className={`flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow transition-colors ${
              wishlisted ? "text-primary" : ""
            }`}
          >
            ♥
          </button>
          <button
            type="button"
            aria-label="Compare"
            onClick={() => setCompared((v) => !v)}
            className={`flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow transition-colors ${
              compared ? "text-primary" : ""
            }`}
          >
            ⇄
          </button>
        </div>
      </div>

      <div
        className={`mt-4 flex flex-col gap-1 ${
          align === "left" ? "items-start text-left" : "items-center text-center"
        }`}
      >
        <Link href={href} className="font-heading text-sm text-heading hover:text-primary">
          {product.title}
        </Link>
        {product.size && <span className="text-xs text-text-light">{product.size}</span>}
        {product.description && (
          <p className="line-clamp-2 text-xs text-text-light">{product.description}</p>
        )}

        {showAddToCart ? (
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="mt-2 border-b border-black pb-0.5 text-xs uppercase tracking-wider text-black hover:text-primary hover:border-primary"
          >
            Add to cart
          </button>
        ) : (
          <Link
            href={href}
            className="mt-2 border-b border-black pb-0.5 text-xs uppercase tracking-wider text-black hover:text-primary hover:border-primary"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
