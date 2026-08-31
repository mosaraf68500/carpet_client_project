import { notFound } from "next/navigation";
import Container from "@/components/common/Container";
import PageTitleBar from "@/components/common/PageTitleBar";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import JsonLd from "@/components/common/JsonLd";
import { allProducts, getProductBySlug, getRelatedProducts } from "@/data/productCatalog";
import { buildMetadata, productJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);
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

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug);

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <PageTitleBar
        heading={product.title}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop/" },
          { label: product.title, href: null },
        ]}
      />
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
