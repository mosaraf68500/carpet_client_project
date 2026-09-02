import ShopCategoryCard from "./ShopCategoryCard";

// 2 cols mobile, 3 from sm up — matches CategoryGrid.js's columns={3}
// variant (already used for this exact same category set on the homepage),
// not ProductGrid.js's breakpoints, since this is a category grid, not a
// product grid — the site already treats those as two conventions.
export default function ShopCategoryGrid({ categories }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-x-8">
      {categories.map((cat) => (
        <ShopCategoryCard key={cat.href} name={cat.name} image={cat.image} href={cat.href} />
      ))}
    </div>
  );
}
