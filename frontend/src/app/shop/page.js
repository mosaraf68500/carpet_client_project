import PageTitleBar from "@/components/common/PageTitleBar";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import { ShopFiltersProvider } from "@/components/shop/ShopFiltersProvider";
import Container from "@/components/common/Container";
import JsonLd from "@/components/common/JsonLd";
import { shopTitleBar } from "@/data/shopContent";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop luxury carpets, kilims, shawls and more | Doha Furniture أثاث الدوحة",
  description:
    "Explore Doha Furniture أثاث الدوحة's range of handcrafted carpets, kilims, shawls, textiles, tapestries, and more. Filter by category and size to find your perfect piece.",
  path: "/shop/",
});

export default function ShopPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(shopTitleBar.breadcrumb)} />
      <PageTitleBar heading={shopTitleBar.heading} breadcrumb={shopTitleBar.breadcrumb} />
      <ShopFiltersProvider>
        <Container size="wide" className="flex flex-col gap-10 py-12 lg:flex-row">
          <FilterSidebar />
          <ProductGrid />
        </Container>
      </ShopFiltersProvider>
    </>
  );
}
