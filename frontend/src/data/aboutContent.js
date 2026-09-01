// Real "Our story" copy + layout, transcribed from the live site's actual
// about page (client-provided screenshots) — this replaces the earlier
// invented placeholder (reference-html/about.html was a stub with no real
// markup to build from). Brand references in the transcribed copy are
// updated from "The Carpet Cellar" to the Doha Furniture أثاث الدوحة
// rebrand, same treatment already used for the real copy in
// siteContent.aboutSection.
import { footer } from "./siteContent";

export const aboutTitleBar = {
  heading: "Our story",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Our story", href: null },
  ],
};

export const aboutHero = {
  image: "/images/The-Carpet-Cellar-Buy-Carpets-Online-1.jpg",
  alt: "A Doha Furniture أثاث الدوحة hand-knotted carpet styled beneath a living room sofa",
};

export const aboutStory = {
  sections: [
    {
      heading: "Sustainability and preservation – Cornerstones of our company",
      paragraphs: [
        "One of our chief priorities is to be ethically responsible, whether in our sourcing, production or usage. As a brand, it is Doha Furniture أثاث الدوحة's conscious decision to periodically review and improve in these three areas.",
        "We know that nothing stands the test of time better than natural raw materials, when properly looked after. The antique pieces in our collection are testament to this, and so we base all our sourcing decisions on this.",
        "Our production techniques are thoughtful, gentle, and respectful to the environment and to the beautiful wools and silks we work with. We use sustainable age-old techniques, azo-free dyes, and are proud of our lower water consumption, thanks to the quality of the material.",
        "Our customers enjoy the benefits of these principles – the natural longevity of our hand-knotted carpets comes from robust materials and time-tested techniques. Your carpets are made to last for 50 years or more, significantly longer than machine-made or tufted rugs.",
      ],
    },
    {
      heading: "Doha Furniture أثاث الدوحة today – A committed purveyor of rugs online",
      paragraphs: [
        "Doha Furniture أثاث الدوحة has collaborated with eminent museums from around the world, and has been featured in several publications. We have also participated in various art and design fairs and been a part of premier displays of private collections. Our physical stores are landmarks in the art connoisseur circles and are frequented by astute collectors looking for their next acquisition.",
        "When you buy rugs online or offline from Doha Furniture أثاث الدوحة, we provide certificates of authenticity to track genealogy of hand-knotted carpets, as well as approximate age and design details. But selling carpets is not our sole purpose – visitors and browsing aficionados come to Doha Furniture أثاث الدوحة to admire the collection, discover inspiration from bygone civilisations and artists, and often times, leave with their own piece of history.",
      ],
    },
  ],
  midImage: {
    image: "/images/The-Carpet-Cellar-Buy-Carpets-Online-2.jpg",
    alt: "An antique hand-knotted rug beneath a pair of accent chairs in a styled living room",
  },
  cta: { label: "Shop Now", href: "/shop/" },
};

// Store location shown on /about's map section — client-provided Google
// Maps pin (Salwa Rd, Doha), replacing the earlier placeholder Msheireb
// Downtown address. Coordinates + zoom are taken directly from the given
// Maps link so the embed centres on the exact same pin. Phone/email are
// read from siteContent.footer.needHelp (the one site-wide contact
// number/email) rather than duplicated here, so there's a single source to
// update.
export const aboutLocation = {
  heading: "Doha",
  address: ["Salwa Rd,", "Doha, Qatar"],
  storeTimings: ["Sat to Thu: 10:30am to 08:00pm", "Fri: 04:00pm to 09:00pm"],
  phone: footer.needHelp.phone.number,
  email: footer.needHelp.email,
  mapCoords: { lat: 25.2686238, lng: 51.4961823 },
  mapZoom: 17,
};
