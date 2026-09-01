import ServicePageLayout from "@/components/services/ServicePageLayout";
import { services } from "@/data/servicesContent";
import { buildMetadata } from "@/lib/seo";

const service = services.delivery;

export const metadata = buildMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: "/services/delivery/",
  image: service.heroImage,
});

export default function DeliveryServicePage() {
  return <ServicePageLayout service={service} />;
}
