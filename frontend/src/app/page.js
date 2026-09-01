import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import BestsellingCollections from "@/components/home/BestsellingCollections";
import ProductSpotlight from "@/components/home/ProductSpotlight";
import PromoBanner from "@/components/home/PromoBanner";
import BlogSection from "@/components/home/BlogSection";
import PressLogos from "@/components/home/PressLogos";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Luxury handmade carpets online | Doha Furniture أثاث الدوحة",
  description:
    "Shop Doha Furniture أثاث الدوحة's kilims and rugs online, handmade using traditional techniques and premium materials. Find modern, classic and transitional carpets online.",
  path: "/",
});

// Below-the-fold and non-critical for first paint — split out of the main
// homepage bundle. A fixed-height skeleton reserves the section's space so
// it doesn't shift layout in when it mounts.
const InstagramFeed = dynamic(() => import("@/components/home/InstagramFeed"), {
  loading: () => <div className="h-180 animate-pulse bg-box-grey" aria-hidden="true" />,
});

export default function Home() {
  return (
    <>
      {/* The visible hero headline uses <h3> to match the real site's markup
          (reference-html/home.html renders its actual <h1> as visually-hidden
          site-title text) — this reproduces that same pattern instead of
          promoting the hero copy to <h1>, while still giving the page exactly
          one real <h1> for SEO/a11y. */}
      <h1 className="sr-only">Doha Furniture أثاث الدوحة — Luxury Handmade Carpets Online</h1>
      <Hero />
      <BestsellingCollections />
      <ProductSpotlight />
      <PromoBanner />
      <BlogSection />
      <InstagramFeed />
      <PressLogos />
    </>
  ); }
