import CategoryCard from "@/components/common/CategoryCard";

// Presentational grid of category cards, reused by BestsellingCollections (and
// available for other category-card sections later).
export default function CategoryGrid({ categories, columns = 4 }) {
  const colsClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 3
      ? "sm:grid-cols-3"
      : "sm:grid-cols-2";

  return (
    <div className={`grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 ${colsClass}`}>
      {categories.map((cat) => (
        <CategoryCard
          key={cat.name}
          name={cat.name}
          image={cat.image}
          href={cat.href}
          description={cat.description}
          featured={cat.featured}
        />
      ))}
    </div>
  );
}
