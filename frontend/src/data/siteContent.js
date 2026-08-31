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
  // The "Shop" mega menu content below exists in the original markup but is hidden
  // site-wide via a `.old-menu{display:none}` rule in the source CSS, so on the live
  // site hovering "Shop" shows no dropdown. Kept here (unrendered) for later use —
  // flagged for you in the summary.
  megaMenu: {
    columns: [
      {
        heading: "Carpets",
        href: "/product-category/carpets/",
        links: [
          { label: "Transitional", href: "/product-category/carpets/transitional/" },
          { label: "Modern", href: "/product-category/carpets/modern" },
          { label: "Timeless Classics", href: "/product-category/carpets/timeless-classics/" },
          { label: "Antique Persians", href: "/product-category/carpets/antique-persians" },
          { label: "Vintage Collectibles", href: "/product-category/carpets/vintage-collectibles" },
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
    services: {
      heading: "Services",
      links: [
        { label: "Choose your rug", href: "/choose-your-rug/" },
        { label: "Herbal Washing", href: "/herbal-washing/" },
        { label: "Rug Restoration", href: "/restoration/" },
        { label: "Customize your Rug", href: "/customize-your-rug/" },
        { label: "Book An Appointment", href: "/book-an-appointment/" },
        { label: "FAQs", href: "/faqs/" },
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
  mobileTabs: [
    { label: "Home", href: "/", icon: "home" },
    { label: "Shop", href: "/shop/", icon: "shop" },
    { label: "Wishlist", href: "/wishlist/", icon: "wishlist" },
    { label: "Cart", href: "/cart/", icon: "cart" },
    { label: "Search", href: "#", icon: "search" },
  ],
};

export const currencySwitcher = {
  current: "INR",
  options: ["INR", "USD"],
};

export const heroSlides = [
  {
    id: "slide-1",
    title: "Handcrafted masterpieces from the world's finest looms",
    subtitle: null,
    imageDesktop: "/images/Desktop-1.jpg",
    imageMobile: "/images/Mobile-1.jpg",
    cta: { label: "Shop Now", href: "/product-category/carpets/" },
  },
  {
    id: "slide-2",
    title: "An ode to minimalism",
    subtitle: "Expressionist-inspired Erased Luxe rugs",
    imageDesktop: "/images/Desktop-2.jpg",
    imageMobile: "/images/Mobile-2.jpg",
    cta: { label: "Shop Now", href: "/product-category/carpets/" },
  },
  {
    id: "slide-3",
    title: "A tapestry of passion and tradition",
    subtitle: "Handwoven treasures from across the globe",
    imageDesktop: "/images/Desktop-3.jpg",
    imageMobile: "/images/Mobile-3.jpg",
    cta: { label: "Shop Now", href: "/product-category/carpets/" },
  },
  {
    id: "slide-4",
    title: "Inspired by expressionism, perfected in minimalist flatweave rugs",
    subtitle: null,
    imageDesktop: "/images/Home-Banner-Desktop_Slide-4-1.jpg",
    // Missing on the live site itself (404) — see conversion notes.
    imageMobile: "/images/placeholder-hero-mobile-slide-4.jpg",
    cta: { label: "Shop Now", href: "/product-category/carpets/" },
  },
  {
    id: "slide-5",
    title: "Select rugs that speak to your soul",
    subtitle: "Heirlooms of yesterday, masterpieces of today",
    imageDesktop: "/images/Home-Banner-Desktop_Slide-5-1.jpg",
    imageMobile: "/images/Home-Banner-Mobile_Slide-5-1.jpg",
    cta: { label: "Shop Now", href: "/product-category/carpets/" },
  },
];

export const bestsellingCollections = {
  heading: "Our bestselling collections",
  subheading: "World's finest curated treasures",
  categories: [
    { name: "Modern Rugs", image: "/images/Modern.jpg", href: "/product-category/carpets/modern" },
    { name: "Transitional Rugs", image: "/images/Bestselling_Transitional-1.jpg", href: "/product-category/carpets/transitional/" },
    { name: "Timeless Classics", image: "/images/Timeless-Classics.jpg", href: "/product-category/carpets/timeless-classics/" },
    { name: "Antique Persians", image: "/images/Antique-Persian.jpg", href: "/product-category/carpets/antique-persians" },
    { name: "Kilims", image: "/images/Kilims.jpg", href: "/product-category/kilims/" },
    { name: "Vintage Collectibles", image: "/images/Bestselling_Vintage-Collectibles-1.jpg", href: "/product-category/carpets/vintage-collectibles" },
    { name: "Ornamental Florals", image: "/images/Ornamental-Florals-1.jpg", href: "/product-tag/Floral-Rugs/", featured: true },
    { name: "Geometric Vintage Treasures", image: "/images/Geometric-Vintage-Treasures-1.jpg", href: "/product-tag/Geometric-Rugs/", featured: true },
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
  videoUrl:
    "https://www.youtube.com/embed/69L6iq9hq3w?autoplay=1&mute=1&loop=1&playlist=69L6iq9hq3w",
  href: "/should-i-opt-for-a-new-or-antique-rug",
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
  handles: [
    { label: "@carpetcellar", href: "https://www.instagram.com/carpetcellar/" },
    { label: "@thecarpetcellar", href: "https://www.instagram.com/thecarpetcellar/" },
  ],
  profile: {
    username: "thecarpetcellar",
    avatar: "/images/thecarpetcellar.webp",
    bio: "Fine handwoven & hand knotted carpets rugs wall hangings vintage textiles from India, Persia & beyond @carpetcellar",
    followHref: "https://www.instagram.com/thecarpetcellar/",
  },
  // The live export lazy-loads these from Instagram's own CDN via JS; the raw HTML only
  // contains the plugin's placeholder image, so no real post photos were available to copy.
  posts: [
    {
      caption: "The last thing you see before you sleep. The first thing your feet find in the morning.",
      image: "/images/instagram-placeholder.png",
    },
    {
      caption: "Resistance has never needed a podium. Sometimes it just needs a loom, a needle, and the quiet stubbornness of people who refused to let their story disappear.",
      image: "/images/instagram-placeholder.png",
    },
    {
      caption: "The sky broke open. And the room finally matched the mood.",
      image: "/images/instagram-placeholder.png",
    },
    {
      caption: "The 1920s called. They want their confidence back! Bold lines. Perfect symmetry. Effortless glamour.",
      image: "/images/instagram-placeholder.png",
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
  { src: "/images/1.png", alt: "Partner logo 1" },
  { src: "/images/2.png", alt: "Partner logo 2" },
  { src: "/images/3.png", alt: "Partner logo 3" },
  { src: "/images/4.png", alt: "Partner logo 4" },
];

export const footer = {
  newsletter: {
    heading: "Sign up for our newsletter",
    placeholder: "Your Email",
    submitLabel: "Subscribe",
  },
  contactText: "Got questions? Contact Us",
  contactHref: "/contact/",
  columns: [
    {
      heading: "Carpets",
      links: [
        { label: "Transitional", href: "/product-category/carpets/transitional/" },
        { label: "Modern", href: "/product-category/carpets/modern/" },
        { label: "Timeless Classics", href: "/product-category/carpets/timeless-classics/" },
        { label: "Antique Persians", href: "/product-category/carpets/antique-persians/" },
        { label: "Vintage Collectibles", href: "/product-category/carpets/vintage-collectibles/" },
      ],
    },
    {
      heading: "Kilims",
      links: [
        { label: "Vintage Kilims", href: "/product-category/kilims/vintage-kilims/" },
        { label: "New Flatweave Rugs", href: "/product-category/kilims/new-flatweave-rugs/" },
      ],
    },
    {
      heading: "Services",
      links: [
        { label: "Design Quiz", href: "/quiz/" },
        { label: "Customize your Rug", href: "/customize-your-rug/" },
        { label: "Book An Appointment", href: "/book-an-appointment/" },
        { label: "FAQs", href: "/faqs/" },
      ],
    },
    {
      heading: "Press & Media",
      href: "/media/",
      links: [],
    },
    {
      heading: "For More",
      links: [
        { label: "Terms & Conditions", href: "/terms-conditions/" },
        { label: "Shipping & Delivery Policy", href: "/shipping-delivery-policy/" },
        { label: "Privacy Policy", href: "/privacy-policy/" },
      ],
    },
  ],
  needHelp: {
    heading: "Need Help?",
    email: "contact@carpetcellar.com",
    phone: "+91 9811486086",
    location: { label: "New Delhi | Doha", href: "/our-showrooms/" },
    tracking: [
      { label: "Track your order (within India)", href: "https://carpetcellar.shiprocket.co/tracking" },
      { label: "Track your order (outside India)", href: "https://www.fedex.com/en-us/tracking.html" },
    ],
  },
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/thecarpetcellar", icon: "facebook" },
    { label: "Twitter", href: "https://twitter.com/TheCarpetCellar", icon: "twitter" },
    { label: "Instagram", href: "https://www.instagram.com/carpetcellar/", icon: "instagram" },
    { label: "Instagram (secondary)", href: "https://www.instagram.com/thecarpetcellar/", icon: "instagram" },
  ],
  // Distinct legal entity name shown in the source — left unchanged, it is not the brand name.
  copyright: "Woolsheel Traders Pvt. Ltd",
};

export const searchModal = {
  heading: "Search our store",
  placeholder: "Search products",
  popularSearchesLabel: "Popular Searches:",
  popularSearches: [{ label: "T-Shirt", href: "/search/T-Shirt/" }],
  viewAllLabel: "View all search results",
};

export const authModals = {
  login: {
    title: "Sign In",
    usernameLabel: "Username or email",
    usernamePlaceholder: "Your username or email",
    passwordLabel: "Password",
    passwordPlaceholder: "Password",
    rememberLabel: "Stay signed in",
    forgotLabel: "Forgot your password?",
    submitLabel: "Log In",
    switchText: "Don't have an account yet?",
    switchCta: "Sign up",
  },
  register: {
    title: "Sign Up",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    emailLabel: "Email",
    emailHelp: "A link to set a new password will be sent to your email address.",
    acceptLabel: "Yes, I agree with Privacy Policy and Terms of Use",
    submitLabel: "Sign Up",
    switchText: "Already have an account?",
    switchCta: "Log in",
  },
  lostPassword: {
    title: "Lost your password?",
    description:
      "Please enter your username or email address. You will receive a link to create a new password via email.",
    usernameLabel: "Username or email",
    usernamePlaceholder: "Your username or email",
    submitLabel: "Reset password",
    switchText: "Remember now?",
    switchCta: "Back to login",
  },
};

export const cartDrawer = {
  title: "Shopping Cart",
  emptyMessage: "Your cart is currently empty.",
  subtotalLabel: "Subtotal",
  taxLabel: "Tax",
  totalLabel: "Total",
  checkoutLabel: "Checkout",
  viewCartLabel: "View cart",
  noteLabel: "Note",
  couponLabel: "Coupon",
};
