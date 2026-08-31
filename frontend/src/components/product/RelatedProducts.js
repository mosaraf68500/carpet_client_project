import Container from "@/components/common/Container";
import ProductCard from "@/components/common/ProductCard";

export default function RelatedProducts({ products }) {
  if (!products.length) return null;

  return (
    <Container as="section" size="boxed" className="border-t border-border py-16">
      <h2 className="text-center font-heading text-2xl sm:text-3xl">You may also like</h2>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </Container>
  );
}
