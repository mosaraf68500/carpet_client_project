// Content for the 3 real services (see nav.megaMenu.services in
// siteContent.js), rendered by components/services/ServicePageLayout.js.
// Structure follows a real content page from the original site: intro
// blurb, a full-bleed hero image with an overlapping caption card, 4
// alternating image/text rows, then a CTA banner.
//
// Images are a mix of this project's own real lifestyle photography
// (/public/images/The-Carpet-Cellar-Buy-Carpets-Online-*.jpg — previously
// unused, not tied to any specific product listing) and images.unsplash.com
// stock (already whitelisted in next.config.mjs), used where no real photo
// of that exact moment (measuring, packaging, dispatch, etc.) exists yet.
// Every stock URL was verified to resolve before being used here.
export const services = {
  installation: {
    slug: "installation",
    name: "Installation",
    breadcrumbLabel: "Installation",
    metaTitle: "Carpet Installation Services | Doha Carpet سجاد الدوحة",
    metaDescription:
      "Professional measuring, delivery and fitting for hand-knotted carpets and rugs — book carpet installation with our specialists in Doha.",
    introHeading: "Getting your rug installed, done right",
    introText:
      "A beautiful carpet only really comes alive once it's fitted properly — measured for the room, laid flat, and finished with care. Our installation team handles every step in person, so the piece you chose looks and feels exactly as it should from the moment we're done.",
    heroImage: "/images/The-Carpet-Cellar-Buy-Carpets-Online-3.jpg",
    heroAlt: "A large area rug laid and fitted in a furnished living room",
    heroCaption: "How installation works, step by step",
    rows: [
      {
        title: "Measuring & site visit",
        text: "Before anything is cut or delivered, we visit (or ask you to send) accurate measurements of the room, so the size, shape and orientation are right for your space from the start.",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
        alt: "Measuring and drafting room dimensions with a ruler before installation",
      },
      {
        title: "Preparing the space",
        text: "We check the floor and surrounding furniture, clear a path for delivery, and prepare an even, clean surface so the carpet will sit flat and secure once it's down.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
        alt: "An empty room with a bare wood floor, cleared and ready for a carpet to be laid",
      },
      {
        title: "Laying & fitting",
        text: "Our installers lay, align and, where needed, trim or pad the piece so it fits the room precisely — from a single statement rug to wall-to-wall carpet.",
        image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80",
        alt: "A hand-knotted rug being unrolled and laid out, showing its fringe and weave",
      },
      {
        title: "Final walkthrough",
        text: "We walk the finished room with you, checking placement and edges, and make any last adjustments on the spot before we consider the job done.",
        image: "https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?w=1200&q=80",
        alt: "A finished living room with a patterned area rug fitted under the coffee table",
      },
    ],
    ctaHeading: "Ready to get your rug installed?",
    ctaText: "Get in touch and we'll take care of the rest, from measuring to the final walkthrough.",
  },
  fixing: {
    slug: "fixing",
    name: "Fixing",
    breadcrumbLabel: "Fixing",
    metaTitle: "Carpet Repair & Restoration | Doha Carpet سجاد الدوحة",
    metaDescription:
      "Expert carpet and rug repair — edge re-binding, patching and re-weaving — from our restoration specialists in Doha.",
    introHeading: "Careful repair for carpets worth keeping",
    introText:
      "A worn edge or a damaged corner doesn't mean the end of a carpet's story. Our restoration team repairs what can be repaired — re-binding, patching and re-weaving by hand — so a well-loved piece keeps its place in your home.",
    heroImage: "/images/The-Carpet-Cellar-Buy-Carpets-Online-7.jpg",
    heroAlt: "Close-up of a hand-knotted carpet's edge and weave detail during inspection",
    heroCaption: "How our repair process works",
    rows: [
      {
        title: "Inspection & assessment",
        text: "We start by examining the carpet in person or from photos you send us, checking the pile, edges, backing and the extent of any damage.",
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80",
        alt: "Two people closely examining and discussing a piece across a table",
      },
      {
        title: "Getting a quote",
        text: "You'll get a clear, itemised quote and an honest estimate of timeline before any work begins — no surprises once the repair is under way.",
        image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&q=80",
        alt: "A quote being processed at a counter payment terminal",
      },
      {
        title: "The repair process",
        text: "Depending on what's needed, our craftspeople re-bind worn edges, patch or re-weave damaged sections, and restore colour so the repair blends into the piece.",
        image: "/images/The-Carpet-Cellar-Buy-Carpets-Online-6.jpg",
        alt: "A rolled carpet beside an unrolled rug, being carefully handled during restoration",
      },
      {
        title: "Return & delivery",
        text: "Once the repair passes our own quality check, we deliver the carpet back to you, ready to go back down on the floor.",
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
        alt: "The entrance of a modern home where a repaired carpet is delivered back",
      },
    ],
    ctaHeading: "Ready to have your carpet repaired?",
    ctaText: "Send us a few photos or book an assessment, and we'll take it from there.",
  },
  delivery: {
    slug: "delivery",
    name: "Delivery",
    breadcrumbLabel: "Delivery",
    metaTitle: "Carpet Delivery Service | Doha Carpet سجاد الدوحة",
    metaDescription:
      "Careful, tracked delivery and in-home placement for every carpet and rug order from Doha Carpet سجاد الدوحة.",
    introHeading: "Careful delivery, from our workshop to your floor",
    introText:
      "A hand-knotted carpet takes months, sometimes years, to make — the last thing it needs is careless handling on the way to you. Every order is packaged, tracked and delivered with the same care that went into making it.",
    heroImage: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=1600&q=80",
    heroAlt: "A warehouse worker moving palletised orders ready for dispatch",
    heroCaption: "How delivery works",
    rows: [
      {
        title: "Order confirmation",
        text: "We confirm your order details, delivery address and preferred time window before anything leaves our workshop.",
        image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=1200&q=80",
        alt: "An order confirmation screen showing payment and delivery details",
      },
      {
        title: "Careful packaging",
        text: "Every piece is rolled, wrapped and padded to protect the weave, colour and fringes for the journey ahead.",
        image: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=1200&q=80",
        alt: "A carefully sealed cardboard shipping box ready for dispatch",
      },
      {
        title: "Dispatch & tracking",
        text: "Once your order is dispatched, you receive tracking details so you always know exactly when to expect it.",
        image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&q=80",
        alt: "Rows of shelved, labelled orders in a dispatch warehouse",
      },
      {
        title: "In-home delivery & placement",
        text: "Our team delivers to your door and, on request, helps unroll and position the piece in the room.",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
        alt: "A finished bedroom with a patterned rug placed at the foot of the bed",
      },
    ],
    ctaHeading: "Ready to place your order?",
    ctaText: "Browse the collection or get in touch, and we'll take care of getting it to you safely.",
  },
};

export function getServiceBySlug(slug) {
  return services[slug] || null;
}
