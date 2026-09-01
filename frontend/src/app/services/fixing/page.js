import ServicePageLayout from "@/components/services/ServicePageLayout";
import { services } from "@/data/servicesContent";
import { buildMetadata } from "@/lib/seo";

const service = services.fixing;

export const metadata = buildMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: "/services/fixing/",
  image: service.heroImage,
});

export default function FixingServicePage() {
  return <ServicePageLayout service={service} />;
}
