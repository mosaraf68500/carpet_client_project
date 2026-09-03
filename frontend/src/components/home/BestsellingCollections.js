import CategoryGrid from "./CategoryGrid";
import Container from "@/components/common/Container";
import { getProducts } from "@/lib/api";

// Same fallback convention as the shop/category/product pages.
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80";

function toCardProps(product, featured = false) {
  return {
    name: product.title,
    image: product.images?.[0]?.url || FALLBACK_IMAGE,
    href: `/product/${product.slug}/`,
    description: product.description,
    // CategoryCard renders a wider (2:1) aspect ratio when featured — the
    // old data tagged the 2 "curated" items this way; preserved here since
    // it's a whole dedicated sub-section now rather than a filtered flag.
    featured,
  };
}

// Async Server Component: both sub-sections are dashboard-controlled via
// each product's `homepageSection` field (backend: product.model.ts) —
// "bestselling" for the main grid, "curated" for the featured pair below
// it. Each hides independently if its own fetch comes back empty; the
// whole component renders nothing only if BOTH are empty.
export default async function BestsellingCollections() {
  const [bestselling, curated] = await Promise.all([
    getProducts({ homepageSection: "bestselling", limit: 6 }),
    getProducts({ homepageSection: "curated", limit: 2 }),
  ]);

  const bestsellingProducts = bestselling.items.map((p) => toCardProps(p));
  const curatedProducts = curated.items.map((p) => toCardProps(p, true));

  if (bestsellingProducts.length === 0 && curatedProducts.length === 0) {
    return null;
  }

  return (
    <>
      {bestsellingProducts.length > 0 && (
        <Container as="section" size="boxed" className="py-16">
          <h2 className="text-center font-heading text-3xl text-accent-green sm:text-4xl">
            Our bestselling collections
          </h2>
          <div className="mt-10">
            <CategoryGrid categories={bestsellingProducts} columns={3} mobileColumns={1} />
          </div>
        </Container>
      )}

      {curatedProducts.length > 0 && (
        <section className="bg-cream py-16">
          <Container size="boxed">
            <h3 className="text-center font-heading text-2xl text-accent-green sm:text-3xl">
              World&apos;s finest curated treasures
            </h3>
            <div className="mt-8">
              <CategoryGrid categories={curatedProducts} columns={2} mobileColumns={1} />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
