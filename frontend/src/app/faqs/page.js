import PageTitleBar from "@/components/common/PageTitleBar";
import Container from "@/components/common/Container";
import FaqAccordion from "@/components/faq/FaqAccordion";
import JsonLd from "@/components/common/JsonLd";
import { faqTitleBar, faqs } from "@/data/faqContent";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQs | Doha Carpet سجاد الدوحة",
  description: "Answers to common questions about our handmade rugs, sizing, customization, delivery, and appointments.",
  path: "/faqs/",
});

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <PageTitleBar heading={faqTitleBar.heading} breadcrumb={faqTitleBar.breadcrumb} />
      <Container size="boxed" className="py-14">
        <FaqAccordion items={faqs} />
      </Container>
    </>
  );
}
