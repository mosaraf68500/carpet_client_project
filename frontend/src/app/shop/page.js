import PageTitleBar from "@/components/common/PageTitleBar";
import ShopCategoryGrid from "@/components/shop/ShopCategoryGrid";
import Container from "@/components/common/Container";
import JsonLd from "@/components/common/JsonLd";
import { shopTitleBar } from "@/data/shopContent";
import { bestsellingCollections } from "@/data/siteContent";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop luxury carpets, kilims, shawls and more | Doha Furniture أثاث الدوحة",
  description:
    "Browse Doha Furniture أثاث الدوحة's carpet, kilim, and textile categories, and find your perfect handcrafted piece.",
  path: "/shop/",
});

// Same category set BestsellingCollections uses for its main (non-featured)
// grid on the homepage — the only categories in the data that carry both a
// real /product-category/ route and a real image. See shop/page.js's report
// note for why this was chosen over the filter sidebar's category tree
// (no images) and the full flattened productCategories list (only 6 of ~21
// entries have images, and most are sub-category granularity, not the
// top-level collections a landing grid should show).
const shopCategories = bestsellingCollections.categories.filter((c) => !c.featured);

export default function ShopPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(shopTitleBar.breadcrumb)} />
      <PageTitleBar heading={shopTitleBar.heading} breadcrumb={shopTitleBar.breadcrumb} />
      <Container size="boxed" className="py-14">
        <ShopCategoryGrid categories={shopCategories} />
      </Container>
    </>
  );
}
