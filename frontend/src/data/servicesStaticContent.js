// Only the parts of each /services/[slug] page that stay hardcoded per the
// Phase 3 decision — SEO meta and CTA copy rarely change and aren't worth
// dashboard control. Everything else (title, intro, steps, hero image) now
// comes from the real Service record via getServiceBySlug(slug) in each
// page. Copied verbatim from the old servicesContent.js so no existing copy
// was lost — this file replaces that one, which no longer has any consumer.
export const servicesStaticContent = {
  installation: {
    metaTitle: "Carpet Installation Services | Doha Furniture أثاث الدوحة",
    metaDescription:
      "Professional measuring, delivery and fitting for hand-knotted carpets and rugs — book carpet installation with our specialists in Doha.",
    ctaHeading: "Ready to get your rug installed?",
    ctaText: "Get in touch and we'll take care of the rest, from measuring to the final walkthrough.",
  },
  fixing: {
    metaTitle: "Carpet Repair & Restoration | Doha Furniture أثاث الدوحة",
    metaDescription:
      "Expert carpet and rug repair — edge re-binding, patching and re-weaving — from our restoration specialists in Doha.",
    ctaHeading: "Ready to have your carpet repaired?",
    ctaText: "Send us a few photos or book an assessment, and we'll take it from there.",
  },
  delivery: {
    metaTitle: "Carpet Delivery Service | Doha Furniture أثاث الدوحة",
    metaDescription:
      "Careful, tracked delivery and in-home placement for every carpet and rug order from Doha Furniture أثاث الدوحة.",
    ctaHeading: "Ready to place your order?",
    ctaText: "Browse the collection or get in touch, and we'll take care of getting it to you safely.",
  },
};
