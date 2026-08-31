"use client";

import Button from "@/components/common/Button";
import { useUI } from "@/components/layout/UIProvider";

// "Add to cart" opens the (currently empty) cart drawer rather than a dead
// button — there's no real cart backend yet (see CartDrawer.js), but this
// keeps the interaction real instead of doing nothing on click.
export default function ProductInfo({ product }) {
  const { openPanel } = useUI();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-2xl sm:text-3xl">{product.title}</h1>
      {product.size && <p className="text-sm text-text-light">Size: {product.size}</p>}
      <p className="text-xl font-medium text-body">
        {product.priceOnRequest ? "Price available on request" : product.price}
      </p>
      {product.description && <p className="text-body">{product.description}</p>}

      <div className="mt-4">
        {product.priceOnRequest ? (
          <Button href="/quote/" variant="dark">
            Request a Quote
          </Button>
        ) : (
          <Button type="button" onClick={() => openPanel("cart")} variant="dark">
            Add to cart
          </Button>
        )}
      </div>
    </div>
  );
}
