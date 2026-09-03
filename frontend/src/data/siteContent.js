// All text/content extracted from the original WordPress/Elementor export (index.html),
// with every "Carpet Cellar" / "carpetcellar" brand reference replaced per the rebrand.

export const brand = {
  name: "Doha Furniture أثاث الدوحة",
  logo: "/images/Layer-1-720x56.png",
  logoAlt: "Doha Furniture أثاث الدوحة",
};

export const nav = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop/", hasMegaMenu: true },
    // TODO: replace with real design once client provides it — the
    // dropdown itself is built from reference-html/services-dropdown-navbar.html,
    // a screenshot reconstruction, not real markup.
    { label: "Services", isServicesDropdown: true },
    { label: "About", href: "/about/" },
    { label: "Blog", href: "/blog/" },
  ],
  // The "Shop" mega menu content below exists in the original markup but was hidden
  // site-wide on the live site via a `.old-menu{display:none}` rule in the source CSS.
  // Rendered here as a real hover-dropdown (ShopDropdown) per product decision — these
  // are also the single source of truth for the /product-category/ routes generated in
  // data/productCategories.js, so the dropdown and the routes never drift apart.
  megaMenu: {
    columns: [
      // This column is the one entry from the old fake nested-category data
      // that's still live — the Footer (see `footer.columnGroups` below)
      // pulls it directly by heading. No real backend category matches any
      // of these labels, so every href here falls back to /shop rather than
      // a dead nested slug. The other columns below are otherwise unused
      // (superseded by ShopDropdown/Navbar's live category-tree fetch) and
      // are left as-is.
      {
        heading: "Carpets",
        href: "/shop/",
        links: [
          { label: "Transitional", href: "/shop/" },
          { label: "Modern", href: "/shop/" },
          { label: "Timeless Classics", href: "/shop/" },
          { label: "Antique Persians", href: "/shop/" },
          { label: "Vintage Collectibles", href: "/shop/" },
        ],
      },
      {
        heading: "Kilims",
        href: "/product-category/kilims/",
        links: [
          { label: "Vintage Kilims", href: "/product-category/kilims/vintage-kilims/" },
          { label: "New Flatweave rugs", href: "/product-category/kilims/new-flatweave-rugs/" },
        ],
      },
      {
        heading: "Shawls & Stoles",
        href: "/product-category/shawls-stoles/",
        links: [
          { label: "Shawls", href: "/product-category/shawls-stoles/shawls/" },
          { label: "Stoles", href: "/product-category/shawls-stoles/stoles/" },
          { label: "Antique Jamewar Shawls", href: "/product-category/textiles-wall-hangings/antique-jamewar-shawls" },
          { label: "Scarves", href: "/product-category/shawls-stoles/scarves/" },
          { label: "Gents Shawls", href: "/product-category/shawls-stoles/gents-shawls/" },
        ],
      },
      {
        heading: "Textiles & Wall Art",
        href: "/product-category/textiles-wall-art",
        links: [
          { label: "Textiles", href: "/product-category/textiles-wall-hangings/textiles/" },
          { label: "Tapestry", href: "/product-category/textiles-wall-hangings/tapestry/" },
          { label: "Blankets", href: "/product-category/textiles-wall-hangings/blankets" },
          { label: "Pichwai & Other Art", href: "/product-category/textiles-wall-hangings/pichwai-other-art" },
          { label: "Saddle Bags & Cushions", href: "/product-category/textiles-wall-hangings/saddle-bags-cushions" },
        ],
      },
      { heading: "Clearance", href: "/product-category/clearance", links: [] },
    ],
    // The 3 real services this business offers — replaces the earlier
    // 6-item placeholder (Choose your rug / Herbal Washing / Rug
    // Restoration / Customize your Rug / Book An Appointment / FAQs),
    // which was invented from a screenshot, not real.
    services: {
      heading: "Services",
      links: [
        { label: "Installation", href: "/services/installation/" },
        { label: "Fixing", href: "/services/fixing/" },
        { label: "Delivery", href: "/services/delivery/" },
      ],
    },
    about: {
      heading: "About",
      links: [
        { label: "Our Story", href: "/our-story/" },
        { label: "Our Showrooms", href: "/our-showrooms/" },
      ],
    },
  },
};

export const searchField = {
  placeholder: "Search products...",
};

// heroSlides' cta.href previously pointed at fake nested category paths
// (e.g. /product-category/carpets/) from the old mock category system.
// None of those slugs exist as real backend categories, so every slide's
// CTA falls back to /shop rather than linking to a slug that doesn't exist
// — re-point these to a real category slug if/when one is a good match for
// a given slide's imagery.
export const heroSlides = [
  {
    id: "slide-1",
    title: "Handcrafted masterpieces from the world's finest looms",
    subtitle: null,
    imageDesktop: "/images/Desktop-1.jpg",
    imageMobile: "/images/Mobile-1.jpg",
    cta: { label: "Shop Now", href: "/shop/" },
  },
  {
    id: "slide-2",
    title: "An ode to minimalism",
    subtitle: "Expressionist-inspired Erased Luxe rugs",
    imageDesktop: "/images/Desktop-2.jpg",
    imageMobile: "/images/Mobile-2.jpg",
    cta: { label: "Shop Now", href: "/shop/" },
  },
  {
    id: "slide-3",
    title: "A tapestry of passion and tradition",
    subtitle: "Handwoven treasures from across the globe",
    imageDesktop: "/images/Desktop-3.jpg",
    imageMobile: "/images/Mobile-3.jpg",
    cta: { label: "Shop Now", href: "/shop/" },
  },
  {
    id: "slide-4",
    title: "Inspired by expressionism, perfected in minimalist flatweave rugs",
    subtitle: null,
    imageDesktop: "/images/Home-Banner-Desktop_Slide-4-1.jpg",
    // Missing on the live site itself (404) — see conversion notes.
    imageMobile: "/images/placeholder-hero-mobile-slide-4.jpg",
    cta: { label: "Shop Now", href: "/shop/" },
  },
  {
    id: "slide-5",
    title: "Select rugs that speak to your soul",
    subtitle: "Heirlooms of yesterday, masterpieces of today",
    imageDesktop: "/images/Home-Banner-Desktop_Slide-5-1.jpg",
    imageMobile: "/images/Home-Banner-Mobile_Slide-5-1.jpg",
    cta: { label: "Shop Now", href: "/shop/" },
  },
];

// categories[].href previously pointed at fake nested category paths (and,
// for the last two, a /product-tag/ route that never existed in this app
// at all). Cross-referenced against the real backend categories (GET
// /api/categories) — the only category that exists there is a malformed
// leftover test record with no real `name`, so there's no reasonable match
// for any of these curated picks. All 8 fall back to /shop rather than
// linking to a slug that doesn't exist. Re-point individual entries to a
// real category slug once matching real categories exist in the DB.
export const bestsellingCollections = {
  heading: "Our bestselling collections",
  subheading: "World's finest curated treasures",
  categories: [
    {
      name: "Modern Rugs",
      image: "/images/Modern.jpg",
      href: "/shop/",
      description: "Browse newly created designs inspired by art, architecture and more.",
    },
    {
      name: "Transitional Rugs",
      image: "/images/Bestselling_Transitional-1.jpg",
      href: "/shop/",
      description: "Hunt for treasures amidst these transitional designs and sophisticated colour palettes.",
    },
    {
      name: "Timeless Classics",
      image: "/images/Timeless-Classics.jpg",
      href: "/shop/",
      description: "Our range of skillful reproductions of cherished antiques from Persia, Middle East, and more.",
    },
    {
      name: "Antique Persians",
      image: "/images/Antique-Persian.jpg",
      href: "/shop/",
      description: "Invest in a family heirloom and take home a genuine antique carpet to suit any home.",
    },
    {
      name: "Kilims",
      image: "/images/Kilims.jpg",
      href: "/shop/",
      description: "Discover antique Kilims from Persia and Central Asia and their exquisite reproductions.",
    },
    {
      name: "Vintage Collectibles",
      image: "/images/Bestselling_Vintage-Collectibles-1.jpg",
      href: "/shop/",
      description: "Make a statement with striking Kilim and Vintage Collectibles from nomadic cultures.",
    },
    { name: "Ornamental Florals", image: "/images/Ornamental-Florals-1.jpg", href: "/shop/", featured: true },
    { name: "Geometric Vintage Treasures", image: "/images/Geometric-Vintage-Treasures-1.jpg", href: "/shop/", featured: true },
  ],
};

export const productSpotlight = {
  heading: "Product Spotlight",
  products: [
    {
      title: "Vintage Maharaja Kashmir – Nirvana",
      slug: "vintage-maharaja-kashmir-nirvana",
      size: "8.10 x 6.2",
      price: "₹435,000",
      priceOnRequest: false,
      image: "/images/C-6363-1.jpg",
      hoverImage: "/images/C-6363-2.jpg",
      primaryCta: "Add to cart",
    },
    {
      title: "Antique Amritsar Jail – Flowering Vines",
      slug: "antique-amritsar-jail-flowering-vines",
      size: "12x9",
      price: null,
      priceOnRequest: true,
      image: "/images/Amritsar-Jail-Flowering-Vines-Persian-Carpet-1.jpg",
      hoverImage: "/images/Amritsar-Jail-Flowering-Vines-Persian-Carpet-2.jpg",
      primaryCta: "View Details",
    },
    {
      title: "Antique Persian Isfahan Serafian – Zahra",
      slug: "antique-persian-isfahan-serafian-zahra",
      size: "10.7 x 7.2",
      price: null,
      priceOnRequest: true,
      image: "/images/C-6453-1.jpg",
      hoverImage: "/images/C-6453-2.jpg",
      primaryCta: "View Details",
    },
    {
      title: "Vintage Sultanabad Ziegler – Sahar",
      slug: "vintage-sultanabad-ziegler-sahar",
      size: "14.6 x 12.1",
      price: null,
      priceOnRequest: true,
      image: "/images/C-5212-1.jpg",
      hoverImage: "/images/C-5212-2.jpg",
      primaryCta: "View Details",
    },
    {
      title: "Antique Persian Kashan – Fayruz",
      slug: "antique-persian-kashan-fayruz",
      size: "12.1 x 9.10",
      price: null,
      priceOnRequest: true,
      image: "/images/C-6564-1.jpg",
      hoverImage: "/images/C-6564-2.jpg",
      primaryCta: "View Details",
    },
    {
      title: "Antique Agra Jail – Celestine",
      slug: "antique-agra-jail-celestine",
      size: "11.9 x 8.11",
      price: null,
      priceOnRequest: true,
      image: "/images/C-6555-1.jpg",
      hoverImage: "/images/C-6555-2.jpg",
      primaryCta: "View Details",
    },
    {
      title: "Antique Persian Tabrez – Negin",
      slug: "antique-persian-tabrez-negin",
      size: "11.7 x 8.2",
      price: null,
      priceOnRequest: true,
      image: "/images/C-6472-1.jpg",
      hoverImage: "/images/C-6472-2.jpg",
      primaryCta: "View Details",
    },
    {
      title: "Antique Persian Laver Kerman – Gulistan",
      slug: "antique-persian-laver-kerman-gulistan",
      size: "17.7 x 9.9",
      price: null,
      priceOnRequest: true,
      image: "/images/C-6235-1.jpg",
      hoverImage: "/images/C-6235-2.jpg",
      primaryCta: "View Details",
    },
  ],
};

export const promoBanner = {
  heading: "Timeless tradition meets contemporary artistry!",
  description:
    "Drawing inspiration from the intricate patterns of antique hand-knotted carpets, our new revival collections breathe life into centuries-old designs. Each piece pays homage to its historical roots while being thoughtfully reimagined for modern interiors, preserving the legacy of craftsmanship through meticulous detail, natural dyes, and heritage weaving techniques.",
  cta: { label: "Know more", href: "/should-i-opt-for-a-new-or-antique-rug" },
  videoUrl:
    "https://www.youtube.com/embed/69L6iq9hq3w?autoplay=1&mute=1&loop=1&playlist=69L6iq9hq3w",
};

export const trustBadges = [
  { title: "Exceptional", subtitle: "workmanship", image: "/images/Exceptional-Workmanship.png" },
  { title: "Global", subtitle: "shipping", image: "/images/Global-Shipping.png" },
  { title: "Sustainably", subtitle: "created", image: "/images/Sustainably-Created.png" },
];

export const blogSection = {
  heading: "The Doha Furniture أثاث الدوحة Blog",
  description:
    "Delve into the magical world of hand-knotted carpets from the exotic regions of Persia, Morocco, Africa and more. Get inspiration, find care advice, and discover the stories behind the art.",
  posts: [
    {
      title: "Why vintage rugs and carpets are an investment",
      category: "All Posts",
      image: "/images/TheCarpetCellar17441F-740x480.jpg",
      href: "/why-vintage-rugs-and-carpets-are-an-investment/",
    },
    {
      title: "Why Antique Persian Rugs are increasingly popular for modern décor",
      category: "All Posts",
      image: "/images/TCC-8594-Persian-Saroukh-15.x13.6_1-740x480.jpg",
      href: "/why-antique-persian-rugs-are-increasingly-popular-for-modern-decor/",
    },
    {
      title: "What's so special about Persian rugs?",
      category: "All Posts",
      image: "/images/A-9626-Saroukh-Kashan-Guldasta-11.4x8.6-740x480.jpg",
      href: "/whats-so-special-about-persian-rugs/",
    },
  ],
};

export const instagramFeed = {
  heading: "Follow our journey",
  // Was the old pre-rebrand "@carpetcellar | @thecarpetcellar" handle list —
  // replaced with the site name per the client's correction, still linking
  // to the real Instagram profile below.
  handles: [
    { label: "Doha Furniture أثاث الدوحة", href: "https://www.instagram.com/unique_carpet_doha?utm_source=qr" },
  ],
  profile: {
    username: "unique_carpet_doha",
    avatar: "/images/thecarpetcellar.webp",
    bio: "Fine handwoven & hand knotted carpets rugs wall hangings vintage textiles from India, Persia & beyond @unique_carpet_doha",
    followHref: "https://www.instagram.com/unique_carpet_doha?utm_source=qr",
  },
  // Real lifestyle photos supplied for this section (public/followImage/) —
  // replaces the earlier placeholder image (the live export lazy-loads
  // these from Instagram's own CDN via JS, so no real post photos were
  // available to copy from the raw HTML at the time).
  posts: [
    {
      caption: "The last thing you see before you sleep. The first thing your feet find in the morning.",
      image: "/followImage/follow-1.jpg",
    },
    {
      caption: "Resistance has never needed a podium. Sometimes it just needs a loom, a needle, and the quiet stubbornness of people who refused to let their story disappear.",
      image: "/followImage/follow-2.jpg",
    },
    {
      caption: "The sky broke open. And the room finally matched the mood.",
      image: "/followImage/follow-3.jpg",
    },
    {
      caption: "The 1920s called. They want their confidence back! Bold lines. Perfect symmetry. Effortless glamour.",
      image: "/followImage/follow-4.jpg",
    },
  ],
};

export const aboutSection = {
  heading: "About Doha Furniture أثاث الدوحة",
  intro:
    "How does one fill a space with that indefinable feeling of home, of warmth and sanctuary, of higher living and thoughtful appreciation of the finer things in life?",
  introContinued: "The answer is simple: through careful curation of art that sparks joy.",
  cta: { label: "Read More", href: "/our-story/" },
  body: [
    {
      text: "Our experts source fine antique carpets from remote locations for private owners, but we also design and display masterful recreations of traditional and modern carpets, as well as dhurries and kilim rugs.",
    },
    {
      heading: "Choose from our range of luxury rugs and carpets online",
      text: "Our clients can choose from a diverse and beautiful collection of carpets, rugs, kilims, textiles and more.",
    },
    {
      heading: "What to know before buying classic carpets online",
      text: "Our Classic Collection is a curated blend of antique carpets for collectors to choose from, as well as carefully recreated versions for those with a discerning eye.",
    },
    {
      heading: "What to know before buying modern rugs online",
      text: "Our Modern Collection of carpets features contemporary designs made with the time-honoured traditions of carpet weaving, superior quality raw materials, and sustainable dying techniques. Clients with a more minimalist design aesthetic will appreciate the austere colour palette and patterns.",
    },
    {
      heading: "What to know before buying transitional carpets online",
      text: "The Transitional collection of carpets features an intriguing aesthetic – a collection of magnificent styles such as Hadji Jalili, Suzani, and Safavid, in rare pastel tones and open designs. Their remarkable beauty allows them to straddle the timeline of art and appeal to all design preferences.",
    },
    {
      text: "These carpets are made in the silk 'souf' technique, which creates the design in raised pile for thickness, against a flatwoven wool base, making them resilient, yet lush and delightfully soft.",
    },
    {
      heading: "How to buy Kilims online",
      text: "For those looking for a striking piece of art to grace their homes, a Kilim is an unusual and worthwhile choice. Kilims originate in Central Asia, the Middle East, and Africa, and are reminiscent of the exotic bazaars, vibrant colours, and sun-baked landscape of this region.",
    },
    {
      text: "When looking for rugs online, do consider adding a Kilim to your home. The patterns hold up well in busy lifestyles and will even suit families with children or pets. The vibrant patterns are kind to small spills or stains, and will create a warm, welcoming centre for any home.",
    },
    {
      text: "Many clients who choose Kilims online find themselves designing their room around the rug, and it's no wonder. Nothing about a Kilim is understated or muted – they are statement pieces that demand to be admired.",
    },
    {
      heading: "Textiles and shawls",
      text: "Apart from offering carpets online and in store, we also curate and make a range of shawls and textiles. Our collection of antique textile pieces is known by experts for its range and diversity. Our gallery of shawls includes heirlooms that date back to the Jamewar and Kaani style.",
    },
    {
      text: "Our collection consists of gorgeous collectibles as well as new pieces. We use age-old crafting techniques and modern technology to recreate historically accurate designs in high quality material.",
    },
    {
      heading: "Choose an antique carpet that has witnessed history",
      text: "Art comes in many forms, but whether crafted in oil paint, scribbled on a manuscript or musical sheet, or woven in cashmere thread, there is no more priceless representation of the zeitgeist than an antique that has been meticulously preserved.",
    },
    {
      heading: "Buying carpets as investments",
      text: "Buying carpets for daily use",
    },
    {
      heading: "Sustainability and ethics",
      text: "At Doha Furniture أثاث الدوحة, you'll find a delicate blend of history, craftsmanship, and exclusivity, all woven into gorgeous pieces of floor art. Browse through our listings of carpets online to choose something that suits your tastes, or let our experts help you find the perfect piece.",
    },
  ],
};

export const partnerLogos = [
  { src: "/images/1.png", alt: "Elle Decor" },
  { src: "/images/2.png", alt: "Architectural Digest" },
  { src: "/images/3.png", alt: "Vogue" },
  { src: "/images/4.png", alt: "India Today Home" },
];

export const footer = {
  newsletter: {
    heading: "Sign up for our newsletter",
    placeholder: "Your Email",
    submitLabel: "Subscribe",
  },
  contactText: "Got questions? Contact Us",
  contactHref: "/contact/",
  // Grouped into columns the way the footer actually renders them — each
  // inner array is one grid column, stacking multiple heading+link blocks
  // where the design calls for it (Services + Press & Media share a column).
  // Carpets/Services links are pulled from nav.megaMenu (the same source the
  // Shop dropdown uses) instead of a second hardcoded copy, so they can't drift.
  columnGroups: [
    [nav.megaMenu.columns.find((c) => c.heading === "Carpets")],
    [
      { heading: "Services", links: nav.megaMenu.services.links },
      {
        heading: "Press & Media",
        href: "/media/",
        links: [
          { label: "Terms & Conditions", href: "/terms-conditions/" },
          { label: "Privacy Policy", href: "/privacy-policy/" },
        ],
      },
    ],
  ],
  needHelp: {
    heading: "Need Help?",
    whatsapp: { label: "WhatsApp", number: "97477556386" },
    phone: { label: "Phone", number: "97477556386" },
    email: "Carpetunique588@Gmail.com",
  },
  socials: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61582328190916&mibextid=wwXIfr&rdid=k7stD13fPv3DJghe&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18pVw4ghfe%2F%3Fmibextid%3DwwXIfr#",
      icon: "facebook",
    },
    { label: "Twitter", href: "https://twitter.com/TheCarpetCellar", icon: "twitter" },
    { label: "Instagram", href: "https://www.instagram.com/unique_carpet_doha?utm_source=qr", icon: "instagram" },
    { label: "TikTok", href: "https://www.tiktok.com/@unique.carpet?_r=1&_t=ZS-99LSGYa9nAi", icon: "tiktok" },
  ],
  // Distinct legal entity name shown in the source — left unchanged, it is not the brand name.
  copyright: "Woolsheel Traders Pvt. Ltd",
};
