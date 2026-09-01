import PageTitleBar from "@/components/common/PageTitleBar";
import AboutIntro from "@/components/about/AboutIntro";
import AboutCollections from "@/components/about/AboutCollections";
import AboutLocation from "@/components/about/AboutLocation";
import JsonLd from "@/components/common/JsonLd";
import { aboutTitleBar } from "@/data/aboutContent";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

// Real "Our story" layout: hero image, the two real story sections, then
// the Doha showroom location + map — see data/aboutContent.js for the
// transcription source/notes.
export const metadata = buildMetadata({
  title: "Our Story | Doha Furniture أثاث الدوحة",
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
      <AboutLocation />
    </>
  );
}
