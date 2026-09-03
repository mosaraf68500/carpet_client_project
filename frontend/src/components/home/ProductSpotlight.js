import CategoryCard from "@/components/common/CategoryCard";
import Container from "@/components/common/Container";
import { getProducts } from "@/lib/api";

// Same fallback convention as the shop/category/product pages.
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80";

// Async Server Component: dashboard-controlled via each product's
// `homepageSection: "spotlight"` field (backend: product.model.ts), same
// mechanism as BestsellingCollections' 2 sections.
export default async function ProductSpotlight() {
  const { items } = await getProducts({ homepageSection: "spotlight", limit: 8 });

  if (items.length === 0) {
    return null;
  }

  return (
    <Container as="section" size="large" className="pt-15 pb-20.5 mb-23.75">
      <h2 className="text-center font-heading text-3xl sm:text-4xl">Product Spotlight</h2>

      <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <CategoryCard
            key={product.slug}
            name={product.title}
            image={product.images?.[0]?.url || FALLBACK_IMAGE}
            href={`/product/${product.slug}/`}
            description={product.description}
            ctaLabel="View Details"
          />
        ))}
      </div>
    </Container>
  );
}
