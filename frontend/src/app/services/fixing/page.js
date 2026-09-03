import ServicePageLayout from "@/components/services/ServicePageLayout";
import { getServiceBySlug } from "@/lib/api";
import { servicesStaticContent } from "@/data/servicesStaticContent";
import { buildMetadata } from "@/lib/seo";

const SLUG = "fixing";
const FALLBACK_TITLE = "Fixing";
// Same fallback convention as the shop/product/category pages.
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80";
const staticContent = servicesStaticContent[SLUG];

// This is a permanent nav item — a temporarily-missing DB record (not yet
// created in the dashboard, or isActive: false) shouldn't 404 a page a
// user might land on straight from the nav, so lookup failure is swallowed
// rather than passed to notFound().
async function fetchService() {
  try {
    return await getServiceBySlug(SLUG);
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const service = await fetchService();
  return buildMetadata({
    title: staticContent.metaTitle,
    description: staticContent.metaDescription,
    path: `/services/${SLUG}/`,
    image: service?.image?.url,
  });
}

export default async function FixingServicePage() {
  const service = await fetchService();
  const title = service?.title || FALLBACK_TITLE;

  return (
    <ServicePageLayout
      title={title}
      heroImage={service?.image?.url || FALLBACK_IMAGE}
      heroAlt={title}
      contentTitle={service?.contentTitle}
      intro={service?.intro}
      contentImage={service?.contentImage?.url || FALLBACK_IMAGE}
      contentImageAlt={service?.contentTitle || title}
      slideImages={(service?.slideImages || []).map((img) => img.url)}
    />
  );
}
