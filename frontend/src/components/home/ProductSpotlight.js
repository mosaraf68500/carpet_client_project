import ProductCard from "@/components/common/ProductCard";
import Container from "@/components/common/Container";
import { productSpotlight } from "@/data/siteContent";

export default function ProductSpotlight() {
  return (
    <Container as="section" size="large" className="pt-15 pb-20.5 mb-23.75">
      <h2 className="text-center font-heading text-3xl sm:text-4xl">
        {productSpotlight.heading}
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {productSpotlight.products.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            align="left"
            showActions={false}
            showOverlayCta
            showBottomCta={false}
            hoverEffect="zoom"
          />
        ))}
      </div>
    </Container>
  );
}
