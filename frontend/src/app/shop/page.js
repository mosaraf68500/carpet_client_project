import PageTitleBar from "@/components/common/PageTitleBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import AdditionalServices from "@/components/shop/AdditionalServices";
import Container from "@/components/common/Container";
import JsonLd from "@/components/common/JsonLd";
import { getCategories } from "@/lib/api";
import { shopTitleBar } from "@/data/shopContent";
import { additionalServices } from "@/data/additionalServicesContent";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop luxury carpets, kilims, shawls and more | Doha Carpet سجاد الدوحة",
  description:
    "Browse Doha Carpet سجاد الدوحة's carpet, kilim, and textile categories, and find your perfect handcrafted piece.",
  path: "/shop/",
});

// Real Category shape from the API is { _id, name, slug, image: { url,
// publicId }, createdAt, updatedAt } — no `description` field at all, and
// `image` is an object, not a bare string. CategoryCard (component) expects
// { name, image (string), href, description }, so this adapts the data at
// the page level rather than changing the shared component. Falls back to
// the same Unsplash photo already used as the /product-category hero
// fallback when a category has no image — the closest existing
// "placeholder image" convention in the project (searched first; the only
// other candidate, instagram-placeholder.png, is square-cropped for feed
// posts and no longer even referenced anywhere after an earlier pass).
const FALLBACK_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80";

function toCategoryCardProps(category) {
  return {
    name: category.name,
    image: category.image?.url || FALLBACK_CATEGORY_IMAGE,
    href: `/product-category/${category.slug}/`,
    description: undefined,
  };
}

export default async function ShopPage() {
  // Top-level only — this is the landing page, subcategories would just
  // clutter it (they're reachable by clicking through to their parent).
  const categories = await getCategories({ parent: "root" });
  const shopCategories = categories.map(toCategoryCardProps);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(shopTitleBar.breadcrumb)} />
      <PageTitleBar heading={shopTitleBar.heading} breadcrumb={shopTitleBar.breadcrumb} />
      <Container size="boxed" className="py-14">
        <CategoryGrid categories={shopCategories} columns={3} />
      </Container>
      <AdditionalServices services={additionalServices} />
    </>
  );
}
