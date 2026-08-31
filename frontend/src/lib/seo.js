// Central SEO helpers: canonical URL building + JSON-LD schema generators.
//
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

// TODO: the sameAs/contactPoint values below are still the pre-rebrand
// carpetcellar.com social handles, phone, and email carried over from the
// live site export. Left in place (real, working links) rather than
// fabricated Doha Furniture equivalents that wouldn't resolve — swap these
// for the client's real accounts/contact details once provided.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/images/Layer-1-720x56.png"),
    sameAs: [
      "https://www.facebook.com/thecarpetcellar",
      "https://twitter.com/TheCarpetCellar",
      "https://www.instagram.com/thecarpetcellar/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9811486086",
      contactType: "customer service",
      email: "contact@carpetcellar.com",
    },
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

export function productJsonLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image ? [absoluteUrl(product.image)] : undefined,
    description: product.description || undefined,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}/`),
      priceCurrency: "INR",
      price: product.priceOnRequest ? undefined : (product.price || "").replace(/[^\d.]/g, ""),
      availability: "https://schema.org/InStock",
    },
  };
}
