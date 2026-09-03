import Link from "next/link";
import CategoryCard from "@/components/common/CategoryCard";
import Toolbar from "./Toolbar";

// Same fallback convention as the category hero/cards — see
// app/shop/page.js and app/product-category/[...slug]/page.js.
const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80";

// Plain (non-client) component now: pagination is server-side, driven by
// the ?page= query param and real total/totalPages from the API, not
// local React state over a sliced mock array. Prev/Next/page-number links
// navigate via <Link href>, which re-runs the page's data fetch — no
// client JS needed for this. No price is rendered anywhere here — real
// products would need explicit price wiring that was never present in
// this component to begin with (it already rendered title/image/
// description/"View Details" only, from the last pass before this task).
export default function ProductGrid({ products, total, page, totalPages, basePath }) {
  const pageHref = (p) => (p === 1 ? basePath : `${basePath}?page=${p}`);

  return (
    <div className="flex-1">
      <Toolbar shownCount={products.length} total={total} />

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
        {products.map((product) => (
          <CategoryCard
            key={product.slug}
            name={product.title}
            image={product.images?.[0]?.url || FALLBACK_PRODUCT_IMAGE}
            hoverImage={product.images?.[1]?.url || product.images?.[0]?.url}
            href={`/product/${product.slug}/`}
            description={product.description}
            ctaLabel="View Details"
          />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-14 text-center text-body">No products in this category yet.</p>
      )}

      {totalPages > 1 && (
        <nav aria-label="Product pagination" className="mt-14 flex items-center justify-center gap-2">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="px-3 text-sm text-body hover:text-black">
              Prev
            </Link>
          ) : (
            <span className="px-3 text-sm text-body opacity-40" aria-disabled="true">
              Prev
            </span>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) =>
            num === page ? (
              <span
                key={num}
                aria-current="page"
                className="flex h-10 w-10 items-center justify-center border border-black bg-black text-sm text-white"
              >
                {num}
              </span>
            ) : (
              <Link
                key={num}
                href={pageHref(num)}
                className="flex h-10 w-10 items-center justify-center border border-border text-sm hover:border-black"
              >
                {num}
              </Link>
            )
          )}
          {page < totalPages ? (
            <Link href={pageHref(page + 1)} className="px-3 text-sm text-body hover:text-black">
              Next
            </Link>
          ) : (
            <span className="px-3 text-sm text-body opacity-40" aria-disabled="true">
              Next
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
