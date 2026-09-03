// Central SEO helpers: canonical URL building + JSON-LD schema generators.
import { footer } from "@/data/siteContent";

// TODO: replace with the real production domain once the client confirms
// where this deploys — every canonical/OG URL and JSON-LD @id below is
// built from this one constant.
export const SITE_URL = "https://www.dohafurniture.qa";
export const SITE_NAME = "Doha Furniture أثاث الدوحة";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

// Builds a Next.js Metadata object (title/description/canonical/OG/Twitter)
// so every page gets consistent, complete SEO metadata from one call instead
// of re-typing openGraph/twitter/alternates boilerplate per page.
export function buildMetadata({ title, description, path = "/", image = "/images/Layer-1-720x56.png" }) {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: absoluteUrl(image) }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

// sameAs below is the client's real social accounts (Facebook, Instagram,
// TikTok provided directly; Twitter is still the pre-rebrand carpetcellar.com
// handle carried over from the live site export, kept since no replacement
// has been provided for it). contactPoint uses the real phone/email from
// siteContent.footer.needHelp.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/images/Layer-1-720x56.png"),
    sameAs: [
      "https://www.facebook.com/profile.php?id=61582328190916",
      "https://twitter.com/TheCarpetCellar",
      "https://www.instagram.com/unique_carpet_doha",
      "https://www.tiktok.com/@unique.carpet",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${footer.needHelp.phone.number}`,
      contactType: "customer service",
      email: footer.needHelp.email,
    },
  };
}

export function faqJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

// No `offers`/price block — this business shows no pricing anywhere on the
// site (WhatsApp/call/quote only), so real product data has no price field
// to report here, and emitting an empty or fabricated price would be worse
// than omitting `offers` entirely (which schema.org's Product type allows).
export function productJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images?.[0]?.url ? [absoluteUrl(product.images[0].url)] : undefined,
    description: product.description || undefined,
    sku: product.slug,
  };
}
