import PageTitleBar from "@/components/common/PageTitleBar";
import AboutIntro from "@/components/about/AboutIntro";
import AboutCollections from "@/components/about/AboutCollections";
import AboutValues from "@/components/about/AboutValues";
import AboutShowroom from "@/components/about/AboutShowroom";
import JsonLd from "@/components/common/JsonLd";
import { aboutTitleBar } from "@/data/aboutContent";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

// TODO: replace with real design once client provides it — page structure is
// built from reference-html/about.html, a placeholder invented to match the
// site's design tokens, not real markup. Intro/collections copy is real
// (reused from siteContent.aboutSection); values + showroom copy is filler.
export const metadata = buildMetadata({
  title: "About Us | Doha Furniture أثاث الدوحة",
  description:
    "Doha Furniture أثاث الدوحة sources and creates handmade carpets, kilims, and textiles — antique finds and masterful recreations, curated by our specialists.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(aboutTitleBar.breadcrumb)} />
      <PageTitleBar heading={aboutTitleBar.heading} breadcrumb={aboutTitleBar.breadcrumb} />
      <AboutIntro />
      <AboutCollections />
      <AboutValues />
      <AboutShowroom />
    </>
  );
}
