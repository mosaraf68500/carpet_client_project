import PageTitleBar from "@/components/common/PageTitleBar";
import Container from "@/components/common/Container";
import QuoteForm from "@/components/quote/QuoteForm";
import JsonLd from "@/components/common/JsonLd";
import { quoteTitleBar, quoteIntro } from "@/data/quoteContent";
import { getProductBySlug, getProducts } from "@/lib/api";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Request a Quote | Doha Furniture أثاث الدوحة",
  description:
    "Tell us about the rug or carpet you have in mind and a Doha Furniture أثاث الدوحة specialist will get back to you with pricing and availability.",
  path: "/quote/",
});

export default async function QuotePage({ searchParams }) {
  const { product: productSlug } = await searchParams;

  // ProductInfo's "Get a Quote" CTA now links here as ?product=<slug>
  // (previously the raw title, which wasn't a stable lookup key). A
  // missing/invalid slug just means no prefill — not a reason to fail
  // the whole page, so lookup failure is swallowed rather than 404ing.
  //
  // productOptions (the free-text field's autocomplete list) uses a single
  // generous page rather than looping through every page like
  // getAllProducts() does for the sitemap — this is a UX nicety for an
  // autocomplete list, not something that needs to be exhaustively
  // complete, so the extra round-trips aren't worth it here.
  const [{ items: products }, initialProductData] = await Promise.all([
    getProducts({ limit: 100 }),
    productSlug ? getProductBySlug(productSlug).catch(() => null) : Promise.resolve(null),
  ]);

  // {id, title} pairs — QuoteForm resolves the free-text "product of
  // interest" field back to a real product _id by matching its title
  // against this list (the backend's productId field needs a real id, not
  // a slug or typed text). The prefilled product is guaranteed a slot here
  // even if it fell outside the 100-product page above, so the ?product=
  // slug flow from the product detail page always resolves correctly.
  const productOptions = products.map((p) => ({ id: p._id, title: p.title }));
  if (initialProductData && !productOptions.some((p) => p.id === initialProductData._id)) {
    productOptions.push({ id: initialProductData._id, title: initialProductData.title });
  }

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(quoteTitleBar.breadcrumb)} />
      <PageTitleBar heading={quoteTitleBar.heading} breadcrumb={quoteTitleBar.breadcrumb} />
      <Container size="boxed" className="py-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-heading text-2xl">{quoteIntro.heading}</h2>
          <p className="mt-3 text-body">{quoteIntro.text}</p>
          <div className="mt-8">
            <QuoteForm productOptions={productOptions} initialProduct={initialProductData?.title || ""} />
          </div>
        </div>
      </Container>
    </>
  );
}
