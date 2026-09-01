import { SITE_URL } from "@/lib/seo";
import { allProducts } from "@/data/productCatalog";
import { productCategories } from "@/data/productCategories";
import { blogPosts } from "@/data/blogContent";

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    "/",
    "/shop/",
    "/blog/",
    "/about/",
    "/quote/",
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

  const categoryRoutes = productCategories.map((c) => ({
    url: new URL(`/product-category/${c.slug}/`, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productRoutes = allProducts.map((p) => ({
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
