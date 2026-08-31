import PageTitleBar from "@/components/common/PageTitleBar";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import Container from "@/components/common/Container";
import { shopTitleBar } from "@/data/shopContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop luxury carpets, kilims, shawls and more | Doha Furniture أثاث الدوحة",
  description:
    "Explore Doha Furniture أثاث الدوحة's range of handcrafted carpets, kilims, shawls, textiles, tapestries, and more. Choose from a variety of colours, materials, and designs.",
  path: "/shop/",
});

export default function ShopPage() {
  return (
    <>
      <PageTitleBar heading={shopTitleBar.heading} breadcrumb={shopTitleBar.breadcrumb} />
      <Container size="wide" className="flex flex-col gap-10 py-12 lg:flex-row">
        <FilterSidebar />
        <ProductGrid />
      </Container>
    </>
  );
}
