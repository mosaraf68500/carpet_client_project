// Ground truth: reference-html/blog.html (real markup, 3-col grid / 2 tablet /
// 1 mobile, numbered pagination — not "load more" like /shop).

export const blogTitleBar = {
  heading: "Blog",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Blog", href: null },
  ],
};

// `slug` + `href` below point at this app's own /blog/[slug] route. The
// original ground-truth export's permalinks put these posts at the domain
// root (e.g. /weaving-stories-modern-interior-design-pieces/), which this
// app never implemented as routes — that's the 404 these cards used to hit.
//
// `content` on each post below is written copy, not from the ground-truth
// export (blog.html is a listing page only — no article bodies were ever
// captured). It's grounded in each post's real title/category/image, but it
// is NOT client-approved editorial content — swap it for the real article
// text before this goes live. app/blog/[slug]/page.js falls back to a
// "coming soon" state for any post here that has no `content`.
export const blogPosts = [
  {
    slug: "weaving-stories-modern-interior-design-pieces",
    title: "Weaving Stories: Modern interior design pieces",
    href: "/blog/weaving-stories-modern-interior-design-pieces/",
    category: "Uncategorized",
    categoryHref: "/category/uncategorized/",
    image: "/images/blog/cover-image-740x480.jpg",
    alt: "Hadji Jalili",
    content: [
      {
        type: "paragraph",
        text: "Few names carry as much weight in carpet history as Hadji Jalili, the Tabriz master whose late-19th-century workshop turned the pictorial rug into fine art. His palette of soft ivories, dusted blues and warm rose is still the reference point designers reach for when a rug needs to anchor a room rather than just cover a floor.",
      },
      {
        type: "image",
        src: "/images/blog/cover-image-740x480.jpg",
        alt: "Detail of a Jalili-style Tabriz carpet showing its dense floral border",
      },
      { type: "heading", text: "From workshop piece to living-room centerpiece" },
      {
        type: "paragraph",
        text: "What made Jalili's carpets radical in their own time — oversized florals, open fields, a willingness to leave space unfilled — is exactly what makes them read as modern now. A single well-placed antique-style rug does more for a minimalist room than a wall of decor ever could.",
      },
      {
        type: "paragraph",
        text: "Contemporary interior designers borrow this restraint deliberately: one statement carpet, kept as the room's only pattern, with furniture and walls left quiet enough to let the weave do the talking.",
      },
      {
        type: "image",
        src: "/images/blog/cover-image-740x480.jpg",
        alt: "The same Jalili-inspired rug shown in full, laid beneath a seating area",
      },
    ],
  },
  {
    slug: "weaving-stories-from-royal-courts-to-individual-homes",
    title: "Weaving Stories: From royal courts to individual homes",
    href: "/blog/weaving-stories-from-royal-courts-to-individual-homes/",
    category: "Uncategorized",
    categoryHref: "/category/uncategorized/",
    image: "/images/blog/Image-1-Safavid-Empire-740x480.jpg",
    alt: "Safavid Empire",
    content: [
      {
        type: "paragraph",
        text: "Carpet weaving as we know it owes an enormous debt to the Safavid Empire, whose 16th-century shahs turned rug-making from a nomadic craft into a royal industry. Court workshops in Isfahan and Kashan produced pieces so fine that some now hang in museums rather than on floors.",
      },
      {
        type: "paragraph",
        text: "Those court carpets were never meant for ordinary homes — they were diplomatic gifts, palace furnishings, and statements of imperial wealth, woven with silk foundations and thousands of knots per square inch.",
      },
      { type: "heading", text: "How a royal craft became a household one" },
      {
        type: "image",
        src: "/images/blog/Image-1-Safavid-Empire-740x480.jpg",
        alt: "A Safavid-era medallion carpet design with intricate central motif",
      },
      {
        type: "paragraph",
        text: "It took centuries — and the rise of regional weaving cooperatives — for that same craftsmanship to reach individual homes. Today's hand-knotted rugs still carry the DNA of those royal workshops: the medallion layouts, the density of knotting, the patience required to finish a single piece.",
      },
      {
        type: "image",
        src: "/images/blog/Image-1-Safavid-Empire-740x480.jpg",
        alt: "Close-up of knot density typical of Safavid-influenced weaving",
      },
    ],
  },
  {
    slug: "weaving-stories-origins",
    title: "Weaving Stories: Origins",
    href: "/blog/weaving-stories-origins/",
    category: "Uncategorized",
    categoryHref: "/category/uncategorized/",
    image: "/images/blog/cover-image-weaving-stories-740x480.jpg",
    alt: "Weaving stories",
    content: [
      {
        type: "paragraph",
        text: "Long before carpets were sold in showrooms, they were made out of necessity — by nomadic and village weavers who needed warmth, floor covering, and a way to carry their belongings across seasonal migrations. The loom went where the family went.",
      },
      { type: "heading", text: "Pattern as memory" },
      {
        type: "paragraph",
        text: "Early motifs weren't decorative choices in the way we think of them today — they were tribal signatures, passed from mother to daughter, encoding a weaver's region, clan and even her marital status into the geometry of the rug.",
      },
      {
        type: "image",
        src: "/images/blog/cover-image-weaving-stories-740x480.jpg",
        alt: "Geometric tribal motifs typical of early nomadic weaving",
      },
      {
        type: "paragraph",
        text: "That origin still shapes how we read a handmade rug today: the small irregularities, the slight asymmetries, are not flaws. They're the fingerprint of a single weaver working without a printed template, and they're exactly what a machine-made rug can't replicate.",
      },
      {
        type: "image",
        src: "/images/blog/cover-image-weaving-stories-740x480.jpg",
        alt: "A hand-knotted rug's slightly irregular pattern, evidence of handwork",
      },
    ],
  },
  {
    slug: "tales-from-persia-the-rich-history-of-persian-carpets-and-rugs",
    title: "Tales from Persia – The rich history of Persian carpets and rugs",
    href: "/blog/tales-from-persia-the-rich-history-of-persian-carpets-and-rugs/",
    category: "All Posts",
    categoryHref: "/category/all-posts/",
    image: "/images/blog/REF-NO-C-513-PERSIAN-QUM-GARDEN-OF-PARADIES-SIZE-10.6X7-1-740x480.jpg",
    alt: "REF NO C-513 PERSIAN QUM GARDEN OF PARADIES SIZE 10.6X7 (1)",
    content: [
      {
        type: "paragraph",
        text: "Qum, in central Iran, is one of the youngest of the great Persian weaving centres — its workshops only rose to prominence in the 20th century — yet it produces some of the finest silk carpets in the country, prized for tight knotting and luminous colour.",
      },
      {
        type: "paragraph",
        text: "The 'Garden of Paradise' design, seen in this piece, is a recurring theme across Persian weaving: a formal garden laid out in rug form, with flowing water channels, cypress trees and flowering borders representing an earthly vision of paradise.",
      },
      {
        type: "image",
        src: "/images/blog/REF-NO-C-513-PERSIAN-QUM-GARDEN-OF-PARADIES-SIZE-10.6X7-1-740x480.jpg",
        alt: "Garden-of-paradise motif on a Persian Qum silk carpet, showing water channels and cypress trees",
      },
      { type: "heading", text: "Why Qum silk still commands a premium" },
      {
        type: "paragraph",
        text: "A Qum silk carpet can take well over a year to complete on a single loom, with knot counts that dwarf most wool pieces. That density is what gives the surface its sheen and lets the garden motif render in such fine detail.",
      },
      {
        type: "image",
        src: "/images/blog/REF-NO-C-513-PERSIAN-QUM-GARDEN-OF-PARADIES-SIZE-10.6X7-1-740x480.jpg",
        alt: "Close-up of the fine silk knotting characteristic of Qum carpets",
      },
    ],
  },
  {
    slug: "the-centuries-old-journey-of-modern-carpet-designs",
    title: "The centuries-old journey of modern carpet designs",
    href: "/blog/the-centuries-old-journey-of-modern-carpet-designs/",
    category: "All Posts",
    categoryHref: "/category/all-posts/",
    image: "/images/blog/centuries-old-740x480.jpg",
    alt: "centuries old carpet design",
    content: [
      {
        type: "paragraph",
        text: "Trace any modern carpet pattern back far enough and you'll usually land on a design that's centuries old. The medallion-and-corner layout that still dominates rug catalogues today was already standard in Persian court workshops five hundred years ago.",
      },
      { type: "heading", text: "What actually changed" },
      {
        type: "paragraph",
        text: "What's shifted isn't the vocabulary of pattern so much as its density and colour. Modern designers borrow the bones of a classical layout — the central medallion, the repeating border — and strip away detail, leaving open fields of solid colour where a traditional weaver would have filled every inch.",
      },
      {
        type: "image",
        src: "/images/blog/centuries-old-740x480.jpg",
        alt: "A carpet design showing the transition from dense traditional pattern to open modern fields",
      },
      {
        type: "paragraph",
        text: "The result is a rug that still reads as rooted in tradition but sits comfortably in a contemporary room — proof that centuries-old design principles don't need to look dated to stay relevant.",
      },
      {
        type: "image",
        src: "/images/blog/centuries-old-740x480.jpg",
        alt: "A carpet's border detail, showing repeating motifs inherited from classical designs",
      },
    ],
  },
  {
    slug: "incorporating-modern-carpets-into-a-minimalist-home",
    title: "Incorporating modern carpets into a minimalist home",
    href: "/blog/incorporating-modern-carpets-into-a-minimalist-home/",
    category: "All Posts",
    categoryHref: "/category/all-posts/",
    image: "/images/blog/Modern-1-1-740x480.jpg",
    alt: "Modern carpet in a minimalist home",
    content: [
      {
        type: "paragraph",
        text: "Minimalist interiors are often assumed to mean bare floors, but a carpet is one of the few additions that doesn't fight the aesthetic — it just needs restraint. A single low-pile rug in a muted, close-to-neutral tone will add warmth without introducing visual noise.",
      },
      {
        type: "image",
        src: "/images/blog/Modern-1-1-740x480.jpg",
        alt: "A neutral-toned modern rug laid across a minimalist living room floor",
      },
      {
        type: "paragraph",
        text: "The trick is proportion, not pattern. In a minimalist room, an undersized rug reads as an afterthought; oversized, edge-to-edge, it starts to feel like wall-to-wall carpet again. The sweet spot leaves a consistent border of bare floor on every side.",
      },
      { type: "heading", text: "One texture, not zero" },
      {
        type: "paragraph",
        text: "Minimalism isn't about removing texture altogether — flat, hard surfaces in a carpet-free room can feel cold. A finely woven wool or flatweave rug gives a minimalist space the one soft surface it needs, without becoming the room's focal point.",
      },
      {
        type: "image",
        src: "/images/blog/Modern-1-1-740x480.jpg",
        alt: "Close-up of a flatweave rug's texture against a minimalist floor",
      },
    ],
  },
  {
    slug: "here-how-you-can-find-the-perfect-carpets-for-kitchens",
    title: "Here's how you can find the perfect carpets for kitchens",
    href: "/blog/here-how-you-can-find-the-perfect-carpets-for-kitchens/",
    category: "All Posts",
    categoryHref: "/category/all-posts/",
    image: "/images/blog/perfect-kitchen-740x480.jpg",
    alt: "Perfect carpet for a kitchen",
    content: [
      {
        type: "paragraph",
        text: "A kitchen is one of the harder rooms to rug well — spills, heat and constant foot traffic rule out anything too delicate. The first filter should always be material: a flatweave rather than a plush pile, since flatweaves shed crumbs and dry out faster after a mop-up.",
      },
      { type: "heading", text: "Where to place it" },
      {
        type: "paragraph",
        text: "Rather than one large rug across the whole kitchen, a runner in front of the sink and stove — the two spots where you actually stand still — does more for comfort underfoot and is far easier to lift and wash.",
      },
      {
        type: "image",
        src: "/images/blog/perfect-kitchen-740x480.jpg",
        alt: "A flatweave runner placed in front of a kitchen sink",
      },
      {
        type: "paragraph",
        text: "Colour and pattern can do practical work too: a busy print or a mid-tone base hides everyday marks far better than a pale solid, buying you more time between washes without the kitchen ever looking neglected.",
      },
      {
        type: "image",
        src: "/images/blog/perfect-kitchen-740x480.jpg",
        alt: "A patterned kitchen rug that disguises everyday marks and spills",
      },
    ],
  },
  {
    slug: "why-vintage-rugs-and-carpets-are-an-investment",
    title: "Why vintage rugs and carpets are an investment",
    href: "/blog/why-vintage-rugs-and-carpets-are-an-investment/",
    category: "All Posts",
    categoryHref: "/category/all-posts/",
    image: "/images/blog/TheCarpetCellar17441F-740x480.jpg",
    alt: "Vintage rug",
    content: [
      {
        type: "paragraph",
        text: "Unlike most furnishings, a good vintage rug tends to appreciate rather than depreciate. Hand-knotted pieces from established weaving regions are finite by nature — no two are identical, and the workshops that produced the best 20th-century examples are, in many cases, no longer active.",
      },
      {
        type: "paragraph",
        text: "That scarcity is compounded by wear that actually adds value: a slightly faded vintage rug with soft, sun-mellowed colour is often more sought-after than a pristine equivalent, in the same way a well-worn leather jacket reads better than a new one.",
      },
      {
        type: "image",
        src: "/images/blog/TheCarpetCellar17441F-740x480.jpg",
        alt: "A vintage rug showing the gently faded colour collectors look for",
      },
      { type: "heading", text: "What to look for before buying" },
      {
        type: "paragraph",
        text: "Condition still matters at the structural level — check the foundation isn't dry-rotting and the fringe hasn't been over-repaired. Beyond that, provenance (region, workshop, age) is what separates a genuine investment piece from a merely old rug.",
      },
      {
        type: "image",
        src: "/images/blog/TheCarpetCellar17441F-740x480.jpg",
        alt: "The reverse side of a vintage rug, used to check foundation condition",
      },
    ],
  },
  {
    slug: "whats-so-special-about-persian-rugs",
    title: "What's so special about Persian rugs?",
    href: "/blog/whats-so-special-about-persian-rugs/",
    category: "All Posts",
    categoryHref: "/category/all-posts/",
    image: "/images/blog/A-9626-Saroukh-Kashan-Guldasta-11.4x8.6-740x480.jpg",
    alt: "A-9626 Saroukh Kashan Guldasta 11.4x8.6",
    content: [
      {
        type: "paragraph",
        text: "Ask most rug specialists what makes a Persian rug different from any other handmade carpet, and the answer usually starts with regional specificity: a Kashan piece, a Saroukh piece and a Qum piece are each recognisable on sight, because each town's weavers guard their own design vocabulary.",
      },
      {
        type: "image",
        src: "/images/blog/A-9626-Saroukh-Kashan-Guldasta-11.4x8.6-740x480.jpg",
        alt: "The Guldasta (bouquet) motif characteristic of Saroukh Kashan carpets",
      },
      { type: "heading", text: "The Guldasta motif" },
      {
        type: "paragraph",
        text: "This piece carries a Guldasta, or 'bouquet', pattern — repeating clusters of flowers set within a structured field, a Kashan speciality that's been woven with only minor variation for well over a century.",
      },
      {
        type: "paragraph",
        text: "What ultimately sets Persian rugs apart, though, is the combination: hand-spun wool, vegetable dyes that mellow gracefully with age, and knot counts high enough to render fine botanical detail that machine looms simply can't reproduce with the same depth.",
      },
      {
        type: "image",
        src: "/images/blog/A-9626-Saroukh-Kashan-Guldasta-11.4x8.6-740x480.jpg",
        alt: "Full view of the Saroukh Kashan carpet showing its structured floral field",
      },
    ],
  },
  {
    slug: "how-to-style-round-rugs-in-your-home",
    title: "How to style round rugs in your home",
    href: "/blog/how-to-style-round-rugs-in-your-home/",
    category: "All Posts",
    categoryHref: "/category/all-posts/",
    image: "/images/blog/SUPERFINE-SILK-ON-SILK-ARDEBIL-ROUND-CARPET-TCC-9971-7X7-FEET-2-740x480.jpg",
    alt: "Superfine silk on silk Ardebil round carpet, TCC-9971, 7x7 feet",
    content: [
      {
        type: "paragraph",
        text: "Round rugs solve a specific problem rectangular ones can't: they soften a room full of hard angles. A round carpet under a square coffee table, or beneath a rectangular dining table, breaks up the geometry instead of repeating it.",
      },
      { type: "heading", text: "Sizing a round rug correctly" },
      {
        type: "paragraph",
        text: "The most common mistake is going too small. A round rug should extend at least a foot beyond the furniture it's anchoring on every side — a 7x7 foot piece like this silk-on-silk Ardebil, for instance, comfortably seats a round dining table for six with chairs pulled out.",
      },
      {
        type: "image",
        src: "/images/blog/SUPERFINE-SILK-ON-SILK-ARDEBIL-ROUND-CARPET-TCC-9971-7X7-FEET-2-740x480.jpg",
        alt: "A round silk Ardebil carpet centred beneath a round dining table",
      },
      {
        type: "paragraph",
        text: "Round rugs also work well in spaces that don't have an obvious rectangle to fill — a bay window nook, a reading corner, the foot of a curved staircase — anywhere a straight-edged rug would leave awkward gaps.",
      },
      {
        type: "image",
        src: "/images/blog/SUPERFINE-SILK-ON-SILK-ARDEBIL-ROUND-CARPET-TCC-9971-7X7-FEET-2-740x480.jpg",
        alt: "Detail of the round Ardebil carpet's silk-on-silk medallion weave",
      },
    ],
  },
  {
    slug: "cotton-silk-or-wool-carpets-which-material-is-best",
    title: "Cotton, silk or wool carpets – Which material is best?",
    href: "/blog/cotton-silk-or-wool-carpets-which-material-is-best/",
    category: "All Posts",
    categoryHref: "/category/all-posts/",
    image: "/images/blog/Carpet-Cellar-Mood-Shoot-0352-2-740x480.jpg",
    alt: "Carpet mood shoot",
    content: [
      {
        type: "paragraph",
        text: "Cotton, silk and wool each make a fundamentally different rug, and the right choice depends less on budget than on how the piece will actually be used. Wool remains the default for good reason: it's resilient, naturally soil-resistant, and springs back after years of foot traffic.",
      },
      {
        type: "image",
        src: "/images/blog/Carpet-Cellar-Mood-Shoot-0352-2-740x480.jpg",
        alt: "A wool rug shown alongside silk and cotton samples for comparison",
      },
      {
        type: "paragraph",
        text: "Silk trades durability for luminosity — it takes dye and reflects light in a way wool can't match, which is why it's usually reserved for fine detail work or accent pieces rather than a busy hallway.",
      },
      { type: "heading", text: "Where cotton fits in" },
      {
        type: "paragraph",
        text: "Cotton is most often the foundation rather than the pile — the warp and weft a rug is built on — though flatweave cotton rugs also make practical, easy-to-wash options for low-traffic spots like a nursery or a laundry room.",
      },
      {
        type: "image",
        src: "/images/blog/Carpet-Cellar-Mood-Shoot-0352-2-740x480.jpg",
        alt: "Close-up comparing the texture of wool pile against a flatweave cotton rug",
      },
    ],
  },
  {
    slug: "how-to-judge-the-quality-of-your-handmade-carpet",
    title: "How to judge the quality of your handmade carpet",
    href: "/blog/how-to-judge-the-quality-of-your-handmade-carpet/",
    category: "All Posts",
    categoryHref: "/category/all-posts/",
    image: "/images/blog/TheCarpetCellar13175_1-740x480.jpg",
    alt: "Handmade carpet detail",
    content: [
      {
        type: "paragraph",
        text: "The easiest way to judge a handmade carpet's quality is to turn it over. On a genuine hand-knotted piece, the pattern on the back should be almost as crisp as the front — a blurry or fuzzy reverse usually means the rug was tufted, not knotted, and won't hold up the same way over time.",
      },
      {
        type: "image",
        src: "/images/blog/TheCarpetCellar13175_1-740x480.jpg",
        alt: "The reverse of a hand-knotted carpet showing a crisp, mirrored pattern",
      },
      { type: "heading", text: "Knot count and what it actually tells you" },
      {
        type: "paragraph",
        text: "Knot density is a real quality signal but not the whole story — a very high knot count on poor-quality wool is still a poor-quality rug. Feel the pile itself: good wool has a natural lanolin softness and a slight sheen, while dry, brittle fibres are a warning sign regardless of knot count.",
      },
      {
        type: "paragraph",
        text: "Finally, check the fringe. On a real hand-knotted carpet, the fringe is the exposed end of the foundation threads, woven directly into the rug — not a strip sewn on afterward, which is a common shortcut on lower-quality reproductions.",
      },
      {
        type: "image",
        src: "/images/blog/TheCarpetCellar13175_1-740x480.jpg",
        alt: "Close-up of a carpet's fringe, woven directly from the foundation threads",
      },
    ],
  },
];

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) || null;
}

export function getRelatedPosts(slug, count = 3) {
  return blogPosts.filter((p) => p.slug !== slug).slice(0, count);
}

export const blogPagination = {
  currentPage: 1,
  totalPages: 2,
  nextHref: "/blog/page/2/",
};

// Sample article-page content — NOT from the ground-truth export (blog.html
// only has the 12 listing cards above, no individual post markup), and NOT
// wired into any live route (see app/blog/[slug]/page.js, which reads from
// blogPosts above instead). Left here, unused, only as a worked example of
// the `content` block shape (paragraph | heading | image) that a real post
// would need once real article content is available — swap it in via
// getPostBySlug/blogPosts above rather than reviving this array in a route.
export const placeholderBlogPosts = [
  {
    slug: "weaving-stories-modern-interior-design",
    title: "Weaving Stories: Modern Interior Design Pieces",
    href: "/blog/weaving-stories-modern-interior-design/",
    author: "Sarah Al-Thani",
    date: "2026-06-18",
    category: "Design Stories",
    categoryHref: "/blog/",
    image: "https://images.unsplash.com/photo-1600607687644-c7e559097e63?w=1400",
    alt: "Modern interior with a handmade rug",
    excerpt:
      "By the turn of the 20th century, carpet manufacturing had transformed from a village-based enterprise into an industrial one.",
    content: [
      {
        type: "paragraph",
        text: "By the turn of the 20th century, carpet manufacturing had transformed from a village-based enterprise into an industrial one. The innovations of the Industrial Revolution, coupled with the rise of the middle classes, meant that rugs were more accessible than ever and had become a sought-after interior design piece for modern homes.",
      },
      {
        type: "paragraph",
        text: "Today, rugs are used as statement pieces in entrance hallways and to add warmth to exposed timber floors, while carpets are installed wall-to-wall for continual comfort underfoot.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=1600",
        alt: "Hand-knotted rug detail",
      },
      { type: "heading", text: "Wool and sustainable design" },
      {
        type: "paragraph",
        text: "One of the major shifts in carpet manufacturing in recent decades is the development of synthetic fibres. Previously, wool, cotton and silk were the main materials used, but this has shifted toward more affordable nylon, polypropylene and polyester.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1600",
        alt: "Wool rug texture close-up",
      },
      {
        type: "paragraph",
        text: "Carpet manufacturers have responded by crafting rugs using organic fibres and natural dyes, which are far less harmful to the environment than their chemical counterparts.",
      },
      { type: "heading", text: "An antique rug renaissance" },
      {
        type: "paragraph",
        text: "In the interior design world, traditional and antique-inspired rugs are often incorporated into contemporary spaces to add depth and colour. Many people appreciate the patina of a decades-old rug and the stories it has to tell.",
      },
    ],
  },
  {
    slug: "choosing-the-right-rug-size",
    title: "Choosing the Right Rug Size for Your Living Room",
    href: "/blog/choosing-the-right-rug-size/",
    author: "Sarah Al-Thani",
    date: "2026-05-02",
    category: "Buying Guides",
    categoryHref: "/blog/",
    image: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=1400",
    alt: "Living room styled with a large area rug",
    excerpt:
      "Getting the size right is the single biggest factor in whether a rug makes a room feel finished or unfinished.",
    content: [
      {
        type: "paragraph",
        text: "Getting the size right is the single biggest factor in whether a rug makes a room feel finished or unfinished. As a general rule, all four legs of your main seating should rest on the rug.",
      },
      { type: "heading", text: "Measuring your space" },
      {
        type: "paragraph",
        text: "Leave roughly 18 to 24 inches of bare floor between the edge of the rug and the wall on each side for the most balanced look.",
      },
    ],
  },
];

export function getPlaceholderPostBySlug(slug) {
  return placeholderBlogPosts.find((p) => p.slug === slug) || null;
}

export function getRelatedPlaceholderPosts(slug, count = 3) {
  return placeholderBlogPosts.filter((p) => p.slug !== slug).slice(0, count);
}
