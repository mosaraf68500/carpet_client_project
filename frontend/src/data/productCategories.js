// Flattens the real /product-category/... hrefs already extracted into
// nav.megaMenu.columns (siteContent.js) into one lookup table, so
// /product-category/[...slug] can resolve any of those real links instead of
// 404ing on every category the nav/footer/homepage already point to.
import { nav, bestsellingCollections } from "./siteContent";

function normalize(href) {
  return href.replace(/^\/product-category\//, "").replace(/\/$/, "");
}

const fromMegaMenu = nav.megaMenu.columns.flatMap((col) => [
  { href: col.href, label: col.heading },
  ...col.links,
]);

const imageByHref = new Map(
  bestsellingCollections.categories
    .filter((c) => c.href.startsWith("/product-category/"))
    .map((c) => [normalize(c.href), c.image])
);

const bySlug = new Map();
for (const entry of fromMegaMenu) {
  if (!entry.href.startsWith("/product-category/")) continue;
  const slug = normalize(entry.href);
  if (slug && !bySlug.has(slug)) {
    bySlug.set(slug, { slug, label: entry.label, image: imageByHref.get(slug) || null });
  }
}

export const productCategories = [...bySlug.values()];

export function getProductCategory(slugParts) {
  const slug = slugParts.join("/");
  return productCategories.find((c) => c.slug === slug) || null;
}
