import PageTitleBar from "@/components/common/PageTitleBar";
import Container from "@/components/common/Container";
import QuoteForm from "@/components/quote/QuoteForm";
import JsonLd from "@/components/common/JsonLd";
import { quoteTitleBar, quoteIntro } from "@/data/quoteContent";
import { allProducts } from "@/data/productCatalog";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Request a Quote | Doha Furniture أثاث الدوحة",
  description:
    "Tell us about the rug or carpet you have in mind and a Doha Furniture أثاث الدوحة specialist will get back to you with pricing and availability.",
  path: "/quote/",
});

export default function QuotePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(quoteTitleBar.breadcrumb)} />
      <PageTitleBar heading={quoteTitleBar.heading} breadcrumb={quoteTitleBar.breadcrumb} />
      <Container size="boxed" className="py-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-heading text-2xl">{quoteIntro.heading}</h2>
          <p className="mt-3 text-body">{quoteIntro.text}</p>
          <div className="mt-8">
            <QuoteForm productOptions={allProducts.map((p) => p.title)} />
          </div>
        </div>
      </Container>
    </>
  );
}
