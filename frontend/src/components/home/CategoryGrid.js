import CategoryCard from "@/components/common/CategoryCard";

// Presentational grid of category cards, reused by BestsellingCollections
// and the /shop category grid — mobileColumns defaults to 2 so /shop's
// layout doesn't change; BestsellingCollections passes 1 explicitly.
export default function CategoryGrid({ categories, columns = 4, mobileColumns = 2 }) {
  const mobileClass = mobileColumns === 1 ? "grid-cols-1" : "grid-cols-2";
  const colsClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 3
      ? "sm:grid-cols-3"
      : "sm:grid-cols-2";

  return (
    <div className={`grid ${mobileClass} gap-x-6 gap-y-10 sm:gap-x-8 ${colsClass}`}>
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
