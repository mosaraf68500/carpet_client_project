import CategoryGrid from "./CategoryGrid";
import Container from "@/components/common/Container";
import { bestsellingCollections } from "@/data/siteContent";

export default function BestsellingCollections() {
  const mainCategories = bestsellingCollections.categories.filter((c) => !c.featured);
  const featuredCategories = bestsellingCollections.categories.filter((c) => c.featured);

  return (
    <>
      <Container as="section" size="boxed" className="py-16">
        <h2 className="text-center font-heading text-3xl text-accent-green sm:text-4xl">
          {bestsellingCollections.heading}
        </h2>

        <div className="mt-10">
          <CategoryGrid categories={mainCategories} columns={3} />
        </div>
      </Container>

      {/* Real markup wraps this subsection in its own full-width cream
          (#F4F2EB) section, distinct from the white background above. */}
      <section className="bg-cream py-16">
        <Container size="boxed">
          <h3 className="text-center font-heading text-2xl text-accent-green sm:text-3xl">
            {bestsellingCollections.subheading}
          </h3>
          <div className="mt-8">
            <CategoryGrid categories={featuredCategories} columns={2} />
          </div>
        </Container>
      </section>
    </>
  );
}
