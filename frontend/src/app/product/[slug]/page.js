import { notFound } from "next/navigation";
import Container from "@/components/common/Container";
import PageTitleBar from "@/components/common/PageTitleBar";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import JsonLd from "@/components/common/JsonLd";
import { getProductBySlug, getProducts, getAllProducts, getSettings } from "@/lib/api";
import { buildMetadata, productJsonLd, breadcrumbJsonLd } from "@/lib/seo";

// Same fallback convention as the shop/category-listing pages.
const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80";
const RELATED_LIMIT = 5; // fetch 5, drop the current product, show up to 4

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    return {};
  }
  return buildMetadata({
    title: `${product.title} | Doha Furniture أثاث الدوحة`,
    description:
      product.description ||
      `${product.title} — a handcrafted piece from Doha Furniture أثاث الدوحة's carpet and rug collection.`,
    path: `/product/${product.slug}/`,
    image: product.images?.[0]?.url,
  });
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  // product.category is populated by the backend (product.service.ts's
  // getProductBySlug already does `.populate("category", "name slug")`,
  // no backend change needed) — but guard against a null category anyway
  // (e.g. a since-deleted category) rather than assuming it's always set.
  const [sameCategoryResult, settings] = await Promise.all([
    product.category?.slug
      ? getProducts({ category: product.category.slug, limit: RELATED_LIMIT })
      : Promise.resolve({ items: [] }),
    getSettings(),
  ]);

  const related = sameCategoryResult.items
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      image: p.images?.[0]?.url || FALLBACK_PRODUCT_IMAGE,
      description: p.description,
    }));

  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop/" },
    { label: product.title, href: null },
  ];

  const galleryImages = product.images?.length
    ? product.images.map((img) => img.url)
    : [FALLBACK_PRODUCT_IMAGE];

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />
      <PageTitleBar heading={product.title} breadcrumb={breadcrumb} />
      <Container size="boxed" className="py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={galleryImages} title={product.title} />
          <ProductInfo product={product} settings={settings} />
        </div>
      </Container>
      <RelatedProducts products={related} />
    </>
  );
}
