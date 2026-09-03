"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/common/Icons";
import { searchField } from "@/data/siteContent";
import { searchProducts } from "@/lib/api";
import { useUI } from "@/components/layout/UIProvider";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 350;
const MAX_RESULTS = 6;
// Same fallback convention as ProductGrid.js/CategoryCard usages elsewhere.
const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80";

// Live search dropdown for the navbar (and, via the same component with a
// different `id`, the mobile menu panel). Debounced, min 2 characters,
// case-insensitive partial match on title/description (see
// product.service.ts) — there's no standalone "all results" page in this
// app (every product listing is scoped to a category under
// /product-category/[slug]/, there's no flat /shop-all/ or /search/
// route), so this stays dropdown-only rather than linking to a page that
// doesn't exist.
export default function SearchField({ id = "nav-search", className = "" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const router = useRouter();
  const { closePanel } = useUI();

  // Only schedules/runs the debounced fetch — the "query too short" case is
  // handled synchronously in the input's onChange instead of here, since
  // setting state directly in an effect body (rather than inside the async
  // callback below) causes an extra render pass.
  useEffect(() => {
    const trimmed = query.trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (trimmed.length < MIN_QUERY_LENGTH) return;

    debounceRef.current = setTimeout(async () => {
      setStatus("loading");
      try {
        const data = await searchProducts(trimmed, { limit: MAX_RESULTS });
        setResults(data.items || []);
        setStatus("success");
      } catch {
        setResults([]);
        setStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = open && query.trim().length >= MIN_QUERY_LENGTH;

  const goToProduct = (slug) => {
    setOpen(false);
    closePanel("mobileMenu");
    router.push(`/product/${slug}/`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      e.currentTarget.blur();
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      goToProduct(results[0].slug);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex items-center gap-2 border border-border-form bg-white px-4 py-2 transition-colors focus-within:border-black ${className}`}
      >
        <SearchIcon className="h-4 w-4 shrink-0 text-text-light" aria-hidden="true" />
        <label htmlFor={id} className="sr-only">
          Search products
        </label>
        <input
          id={id}
          type="search"
          name="q"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setOpen(true);
            if (value.trim().length < MIN_QUERY_LENGTH) {
              setResults([]);
              setStatus("idle");
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={searchField.placeholder}
          className="w-full bg-transparent text-sm text-black placeholder:text-text-light focus:outline-none"
        />
        {status === "loading" && (
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-border-form border-t-black"
          />
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto border border-border bg-white shadow-lg">
          {status === "loading" && results.length === 0 && (
            <p className="px-4 py-4 text-sm text-text-light">Searching…</p>
          )}

          {status === "error" && <p className="px-4 py-4 text-sm text-red-600">Something went wrong.</p>}

          {status === "success" && results.length === 0 && (
            <p className="px-4 py-4 text-sm text-text-light">No products found.</p>
          )}

          {results.length > 0 && (
            <ul>
              {results.slice(0, MAX_RESULTS).map((product) => (
                <li key={product._id} className="border-b border-border last:border-b-0">
                  <Link
                    href={`/product/${product.slug}/`}
                    onClick={() => {
                      setOpen(false);
                      closePanel("mobileMenu");
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-box-grey"
                  >
                    <Image
                      src={product.images?.[0]?.url || FALLBACK_PRODUCT_IMAGE}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 rounded-xs object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-heading">{product.title}</span>
                      {product.category?.name && (
                        <span className="block truncate text-xs text-text-light">{product.category.name}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
