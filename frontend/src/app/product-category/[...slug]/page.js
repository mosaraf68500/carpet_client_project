import { notFound } from "next/navigation";
import Image from "next/image";
import PageTitleBar from "@/components/common/PageTitleBar";
import Container from "@/components/common/Container";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import { ShopFiltersProvider } from "@/components/shop/ShopFiltersProvider";
import JsonLd from "@/components/common/JsonLd";
import { productCategories, getProductCategory } from "@/data/productCategories";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

// Deviates from the original brief's generic /category/[slug] in favour of
// the site's real WordPress taxonomy path (/product-category/carpets/modern/,
// etc.) — every nav, footer, and homepage category link already points here.
// A catch-all segment is required because these are 1-2 levels deep.
//
// TODO: the product grid below is the full shop catalog, not filtered to
// this category — the mock product data has no category field yet (see
// data/productCatalog.js). Swap in a real filtered query once the backend
// supplies product-category relationships.
export function generateStaticParams() {
  return productCategories.map((c) => ({ slug: c.slug.split("/") }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getProductCategory(slug);
  if (!category) return {};
  return buildMetadata({
    title: `${category.label} | Shop | Doha Furniture أثاث الدوحة`,
    description: `Shop ${category.label} at Doha Furniture أثاث الدوحة — handcrafted carpets, rugs, and textiles.`,
    path: `/product-category/${slug.join("/")}/`,
    image: category.image || undefined,
  });
}

export default async function ProductCategoryPage({ params }) {
  const { slug } = await params;
  const category = getProductCategory(slug);
  if (!category) notFound();
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop/" },
    { label: category.label, href: null },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />
      <PageTitleBar heading={category.label} breadcrumb={breadcrumb} />

      {category.image && (
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src={category.image}
            alt={category.label}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <ShopFiltersProvider>
        <Container size="wide" className="flex flex-col gap-10 py-12 lg:flex-row">
          <FilterSidebar />
          <ProductGrid />
        </Container>
      </ShopFiltersProvider>
    </>
  );
}
