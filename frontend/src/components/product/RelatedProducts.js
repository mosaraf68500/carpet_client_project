import Container from "@/components/common/Container";
import CategoryCard from "@/components/common/CategoryCard";

// Same card style as the shop category grid — plain image, title,
// description, underlined link — reused here for products instead of
// ProductCard's hover-swap/wishlist/compare treatment, per request.
export default function RelatedProducts({ products }) {
  if (!products.length) return null;

  return (
    <Container as="section" size="boxed" className="border-t border-border py-16">
      <h2 className="text-center font-heading text-2xl sm:text-3xl">You may also like</h2>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
        {products.map((product) => (
          <CategoryCard
            key={product.slug}
            name={product.title}
            image={product.image}
            href={`/product/${product.slug}/`}
            description={product.description}
            ctaLabel="View Details"
          />
        ))}
      </div>
    </Container>
  );
}
