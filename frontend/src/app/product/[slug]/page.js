import { notFound } from "next/navigation";
import Container from "@/components/common/Container";
import PageTitleBar from "@/components/common/PageTitleBar";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import JsonLd from "@/components/common/JsonLd";
import { allProducts, getProductBySlug, getRelatedProducts } from "@/data/productCatalog";
import { buildMetadata, productJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return buildMetadata({
    title: `${product.title} | Doha Furniture أثاث الدوحة`,
    description:
      product.description ||
      `${product.title} — a handcrafted piece from Doha Furniture أثاث الدوحة's carpet and rug collection.`,
    path: `/product/${product.slug}/`,
    image: product.image,
  });
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug);
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop/" },
    { label: product.title, href: null },
  ];

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />
      <PageTitleBar heading={product.title} breadcrumb={breadcrumb} />
      <Container size="boxed" className="py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={[product.image, product.hoverImage]} title={product.title} />
          <ProductInfo product={product} />
        </div>
      </Container>
      <RelatedProducts products={related} />
    </>
  );
}
