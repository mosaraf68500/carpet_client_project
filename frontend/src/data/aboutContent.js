// TODO: replace with real design/copy once the client provides it.
// reference-html/about.html is a PLACEHOLDER (generic structure invented to
// match the site's design tokens), not real markup. The intro/story copy
// below reuses the real extracted text already in siteContent.aboutSection
// (from the live homepage's About widget) since that IS real copy; the
// values cards and showroom blurb are invented filler pending the client's
// real content.
import { aboutSection, footer } from "./siteContent";

export const aboutTitleBar = {
  heading: "About Us",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "About Us", href: null },
  ],
};

export const aboutIntro = {
  heading: "Our Story",
  paragraphs: [aboutSection.intro, aboutSection.introContinued, aboutSection.body[0].text],
  image: "/images/The-Carpet-Cellar-Buy-Carpets-Online-1.jpg",
  imageAlt: "A curated Doha Furniture أثاث الدوحة showroom display of handmade rugs",
};

// The richer collection-by-collection copy already extracted in
// siteContent.aboutSection.body — reused here rather than duplicated.
export const aboutCollections = aboutSection.body.slice(1);

// TODO: placeholder filler — replace with the client's real value props.
export const aboutValues = {
  heading: "Why choose us",
  cards: [
    {
      title: "Hand-selected pieces",
      text: "Every rug is personally sourced or crafted by our team, not drop-shipped from a catalogue.",
    },
    {
      title: "Quality guaranteed",
      text: "Traditional weaving techniques and premium materials, checked against our own quality standards.",
    },
    {
      title: "Personal service",
      text: "Our specialists help you choose, customise, and care for a piece that suits your space.",
    },
  ],
};

// TODO: placeholder filler — showroom copy is invented; location/phone/email
// reuse the real values already defined in siteContent.footer.needHelp.
export const aboutShowroom = {
  heading: "Visit our showroom",
  text: "Come see and feel the collection in person. Our specialists are on hand to help you find the right piece, or to talk through a custom order.",
  location: footer.needHelp.location.label,
  phone: footer.needHelp.phone,
  email: footer.needHelp.email,
  cta: { label: "Request a Quote", href: "/quote/" },
};
