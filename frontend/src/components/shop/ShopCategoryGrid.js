import ShopCategoryCard from "./ShopCategoryCard";

// 1 col on mobile, 2 from sm (tablet), 3 from lg (desktop).
export default function ShopCategoryGrid({ categories }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
      {categories.map((cat) => (
        <ShopCategoryCard
          key={cat.href}
          name={cat.name}
          image={cat.image}
          href={cat.href}
          imagePosition={cat.imagePosition}
        />
      ))}
    </div>
  );
}
