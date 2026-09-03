import { SITE_URL } from "@/lib/seo";
import { blogPosts } from "@/data/blogContent";
import { getCategories, getAllProducts } from "@/lib/api";

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    "/",
    "/shop/",
    "/blog/",
    "/about/",
    "/quote/",
    "/services/installation/",
    "/services/fixing/",
    "/services/delivery/",
    "/contact/",
    "/faqs/",
    "/book-an-appointment/",
    "/terms-conditions/",
    "/privacy-policy/",
  ].map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  // Every real category (top-level and subcategory alike) lives at the same
  // single-segment /product-category/[slug]/ route — see lib/api.js's
  // buildCategoryTree comment for how parent/child is represented in the
  // API response instead of in the URL. No ?parent= filter needed here.
  const categories = await getCategories();
  const categoryRoutes = categories.map((c) => ({
    url: new URL(`/product-category/${c.slug}/`, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // getAllProducts() loops through every page — a single getProducts() call
  // can't be assumed to cover the whole catalog once it grows past one
  // page's limit.
  const products = await getAllProducts();
  const productRoutes = products.map((p) => ({
    url: new URL(`/product/${p.slug}/`, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: new URL(post.href, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
