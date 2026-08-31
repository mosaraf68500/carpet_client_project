import CategoryGrid from "./CategoryGrid";
import Container from "@/components/common/Container";
import { bestsellingCollections } from "@/data/siteContent";

export default function BestsellingCollections() {
  const mainCategories = bestsellingCollections.categories.filter((c) => !c.featured);
  const featuredCategories = bestsellingCollections.categories.filter((c) => c.featured);

  return (
    <Container as="section" size="boxed" className="py-16">
      <h2 className="text-center font-heading text-3xl sm:text-4xl">
        {bestsellingCollections.heading}
      </h2>

      <div className="mt-10">
        <CategoryGrid categories={mainCategories} columns={4} />
      </div>

      <h3 className="mt-14 text-center font-heading text-2xl sm:text-3xl">
        {bestsellingCollections.subheading}
      </h3>
      <div className="mt-8">
        <CategoryGrid categories={featuredCategories} columns={2} />
      </div>
    </Container>
  );
}
