// Combines every product mock across the site (homepage spotlight + both
// shop grid pages) into one catalog keyed by slug, so /product/[slug] and
// generateStaticParams have a single source of truth instead of each
// consumer re-merging the same three arrays.
//
// TODO: products carry no `category` field yet — the live export's product
// listings didn't include per-product category assignment, so /product-category/
// pages can't truly filter this catalog by category until a real backend
// supplies that relationship. See app/product-category/[...slug]/page.js.
import { productSpotlight } from "./siteContent";
import { shopProductsPage1, shopProductsPage2 } from "./shopContent";

export const allProducts = [
  ...productSpotlight.products,
  ...shopProductsPage1,
  ...shopProductsPage2,
].filter((product, index, arr) => arr.findIndex((p) => p.slug === product.slug) === index);

export function getProductBySlug(slug) {
  return allProducts.find((p) => p.slug === slug) || null;
}

export function getRelatedProducts(slug, count = 4) {
  return allProducts.filter((p) => p.slug !== slug).slice(0, count);
}
