import ServicePageLayout from "@/components/services/ServicePageLayout";
import { services } from "@/data/servicesContent";
import { buildMetadata } from "@/lib/seo";

const service = services.installation;

export const metadata = buildMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: "/services/installation/",
  image: service.heroImage,
});

export default function InstallationServicePage() {
  return <ServicePageLayout service={service} />;
}
