import { notFound } from "next/navigation";
import Image from "next/image";
import Container from "@/components/common/Container";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductGrid from "@/components/shop/ProductGrid";
import JsonLd from "@/components/common/JsonLd";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/api";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

// Single dynamic segment, not a catch-all — real category slugs are
// globally unique and flat (2 levels max: top-level + subcategory, both
// with their own plain slug, no nested path). See lib/api.js's
// buildCategoryTree for how parent/child is represented in the API
// response instead of in the URL.
const FALLBACK_HERO_IMAGE = "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80";
const PAGE_SIZE = 6;

// Requires the backend to be running and reachable at build time, since
// this now fetches real categories instead of reading a static mock file.
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    return {};
  }
  return buildMetadata({
    title: `${category.name} | Shop | Doha Carpet سجاد الدوحة`,
    description: `Shop ${category.name} at Doha Carpet سجاد الدوحة — handcrafted carpets, rugs, and textiles.`,
    path: `/product-category/${slug}/`,
    image: category.image?.url || undefined,
  });
}

export default async function ProductCategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  // Subcategories: categories whose parentCategory is this one. The list
  // endpoint's ?parent= filter returns them unpopulated, which is all a
  // card grid needs (name/slug/image).
  const children = await getCategories({ parent: category._id });

  // getProducts' `category` param is matched against Category.slug on the
  // backend (product.service.ts), not the raw id — unlike the ?parent=
  // filter above, which does match by id.
  const page = Math.max(1, Number(pageParam) || 1);
  const { items: products, total, totalPages } = await getProducts({
    category: slug,
    page,
    limit: PAGE_SIZE,
  });

  const parent = category.parentCategory;
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop/" },
    ...(parent ? [{ label: parent.name, href: `/product-category/${parent.slug}/` }] : []),
    { label: category.name, href: null },
  ];

  const childCategoryCards = children.map((child) => ({
    name: child.name,
    image: child.image?.url || FALLBACK_HERO_IMAGE,
    href: `/product-category/${child.slug}/`,
    description: undefined,
  }));

  // A category with subcategories is a routing hub, not necessarily a
  // product-bearing leaf — showing "no products yet" there would be
  // misleading. Only the true empty state (no children AND no products)
  // gets that message.
  const showEmptyState = children.length === 0 && products.length === 0;

  return (
    <>
      {/* Breadcrumb schema kept for SEO even though the visible breadcrumb
          bar was dropped in favour of the title-on-image hero below. */}
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />

      <div className="relative flex h-75 w-full items-center justify-center overflow-hidden sm:h-150">
        <Image
          src={category.image?.url || FALLBACK_HERO_IMAGE}
          alt={category.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex flex-col items-center gap-2 px-4 text-center text-white">
          {parent && (
            <p className="text-xs uppercase tracking-wider text-white/70">{parent.name}</p>
          )}
          <h1 className="font-heading text-3xl sm:text-4xl">{category.name}</h1>
        </div>
      </div>

      <Container size="wide" className="flex flex-col gap-14 py-12">
        {children.length > 0 && (
          <div>
            <h2 className="mb-8 font-heading text-2xl sm:text-3xl">Subcategories</h2>
            <CategoryGrid categories={childCategoryCards} columns={3} />
          </div>
        )}

        {showEmptyState ? (
          <p className="text-center text-body">No products in this category yet.</p>
        ) : (
          products.length > 0 && (
            <ProductGrid
              products={products}
              total={total}
              page={page}
              totalPages={totalPages}
              basePath={`/product-category/${slug}/`}
            />
          )
        )}
      </Container>
    </>
  );
}
