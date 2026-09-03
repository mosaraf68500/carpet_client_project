import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// One-off demo-content seed script — NOT part of the normal build/dev flow
// (lives outside src/, only wired into package.json as an optional
// "seed:demo" script). Talks to the ALREADY-RUNNING local backend over
// HTTP through the real public/admin endpoints (login, then the same
// multipart create-category/create-product/create-service contracts the
// dashboard itself uses) rather than writing to MongoDB directly, so every
// image goes through the real Cloudinary pipeline and everything created
// here is visible/editable/deletable via the dashboard afterward exactly
// like real content would be.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ATTRIBUTION_LOG_PATH = path.join(__dirname, "seed-image-attributions.log");

const PORT = process.env.PORT || "5000";
const BASE_URL = `http://localhost:${PORT}/api`;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Openverse's public search API — no API key required. license_type=commercial
// pre-filters to licenses that allow commercial use, but we still explicitly
// re-check the license below since Openverse's "commercial" bucket can
// include ND (no-derivatives) licenses we don't want.
const OPENVERSE_SEARCH_URL = "https://api.openverse.org/v1/images/";
const ACCEPTABLE_LICENSES = new Set(["cc0", "pdm", "by", "by-sa"]);
const MIN_WIDTH = 1000;
const MAX_FILESIZE = 4.5 * 1024 * 1024; // stay under the backend's 5MB/file multer limit
const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const poorResultQueries: string[] = [];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugifyForFilename(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface OpenverseResult {
  id: string;
  title: string;
  foreign_landing_url: string;
  url: string;
  creator: string | null;
  license: string;
  license_version: string | null;
  attribution: string | null;
  width: number;
  height: number;
  filesize: number | null;
  filetype: string | null;
}

async function searchOpenverse(query: string): Promise<OpenverseResult[]> {
  const url = `${OPENVERSE_SEARCH_URL}?q=${encodeURIComponent(query)}&license_type=commercial&size=large`;
  const res = await fetch(url, {
    headers: { "User-Agent": "DohaFurnitureDemoSeedScript/1.0 (one-off local seed script)" },
  });
  if (!res.ok) {
    console.warn(`  Openverse search failed for "${query}": ${res.status} ${res.statusText}`);
    return [];
  }
  const data = (await res.json()) as { results?: OpenverseResult[] };
  const results = data.results ?? [];
  return results.filter(
    (r) =>
      ACCEPTABLE_LICENSES.has((r.license || "").toLowerCase()) &&
      r.width >= MIN_WIDTH &&
      (r.filesize == null || r.filesize <= MAX_FILESIZE)
  );
}

function logAttribution(query: string, result: OpenverseResult): void {
  const line =
    `[${new Date().toISOString()}] query="${query}" ` +
    `title="${result.title}" ` +
    `source=${result.foreign_landing_url} ` +
    `image_url=${result.url} ` +
    `license=${(result.license || "").toUpperCase()}${result.license_version ? ` ${result.license_version}` : ""} ` +
    `creator="${result.creator || "unknown"}" ` +
    `attribution="${result.attribution || ""}"\n`;
  fs.appendFileSync(ATTRIBUTION_LOG_PATH, line, "utf8");
}

interface FetchedImage {
  buffer: Buffer;
  filename: string;
  contentType: string;
}

// Tries each query in `queries` in order (broadest/simplest last), and
// within each query's result list tries each candidate in turn until one
// downloads successfully with an accepted content-type. Returns null (never
// throws) if every query/candidate is exhausted — callers log + skip that
// image slot rather than aborting the batch.
async function fetchImage(queries: string[]): Promise<FetchedImage | null> {
  for (const query of queries) {
    await sleep(300); // be polite to the free, unauthenticated Openverse API
    const results = await searchOpenverse(query);
    if (results.length === 0) {
      console.warn(`  No acceptable Openverse results for "${query}"`);
      if (query === queries[queries.length - 1]) poorResultQueries.push(query);
      continue;
    }

    for (const candidate of results.slice(0, 5)) {
      try {
        const imgRes = await fetch(candidate.url);
        if (!imgRes.ok) throw new Error(`image download status ${imgRes.status}`);
        const contentType = imgRes.headers.get("content-type")?.split(";")[0]?.trim() || "";
        if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
          console.warn(`  Skipping ${candidate.url} — unsupported content-type "${contentType}"`);
          continue;
        }
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        // Openverse's `filesize` field is frequently missing, so the
        // pre-download filter above can't always catch an over-limit file —
        // check the real downloaded size too, against the backend's 5MB/file
        // multer cap, before attempting the upload.
        if (buffer.length > MAX_FILESIZE) {
          console.warn(
            `  Skipping ${candidate.url} — downloaded size ${(buffer.length / 1024 / 1024).toFixed(1)}MB exceeds the 5MB upload limit`
          );
          continue;
        }
        const ext = contentType.split("/")[1];
        const filename = `${slugifyForFilename(query)}-${candidate.id}.${ext}`;
        logAttribution(query, candidate);
        return { buffer, filename, contentType };
      } catch (err) {
        console.warn(`  Failed to download candidate for "${query}" (${candidate.url}): ${(err as Error).message}`);
      }
    }
  }
  return null;
}

function toBlob(image: FetchedImage): Blob {
  return new Blob([new Uint8Array(image.buffer)], { type: image.contentType });
}

// ---- Auth ----

async function login(): Promise<string> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running this script.");
  }
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { token: string };
  return data.token;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// ---- Categories ----

interface CategoryPlan {
  name: string;
  imageQueries: string[];
}

const CATEGORY_PLANS: CategoryPlan[] = [
  { name: "Persian Rugs", imageQueries: ["persian rug", "rug", "carpet"] },
  { name: "Modern Rugs", imageQueries: ["modern area rug", "area rug", "carpet"] },
  { name: "Kilims", imageQueries: ["kilim pattern rug", "kilim", "carpet"] },
  { name: "Vintage Rugs", imageQueries: ["vintage rug", "rug", "carpet"] },
];

async function getOrCreateCategories(token: string): Promise<Record<string, string>> {
  console.log("\n=== Categories ===");
  const res = await fetch(`${BASE_URL}/categories?parent=root`);
  const existing = (await res.json()) as { _id: string; name: string; slug: string }[];
  const existingByName = new Map(existing.map((c) => [c.name.toLowerCase(), c]));

  const idsByName: Record<string, string> = {};

  for (const plan of CATEGORY_PLANS) {
    const already = existingByName.get(plan.name.toLowerCase());
    if (already) {
      console.log(`- "${plan.name}" already exists — skipping.`);
      idsByName[plan.name] = already._id;
      continue;
    }

    console.log(`- Creating "${plan.name}"...`);
    const image = await fetchImage(plan.imageQueries);
    if (!image) {
      console.warn(`  No image found for "${plan.name}" after all fallbacks — creating without an image.`);
    }

    const form = new FormData();
    form.append("name", plan.name);
    if (image) form.append("image", toBlob(image), image.filename);

    const createRes = await fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: authHeaders(token),
      body: form,
    });
    if (!createRes.ok) {
      console.error(`  Failed to create category "${plan.name}": ${createRes.status} ${await createRes.text()}`);
      continue;
    }
    const created = (await createRes.json()) as { _id: string };
    idsByName[plan.name] = created._id;
    console.log(`  Created (${created._id}).`);
  }

  return idsByName;
}

// ---- Products ----

interface ProductPlan {
  title: string;
  description: string;
  categoryName: string;
  sizes: { value: number; unit: "ft" | "cm" }[];
  imageQueries: [string[], string[]];
  homepageSection: "bestselling" | "curated" | "spotlight" | null;
}

const PRODUCT_PLANS: ProductPlan[] = [
  {
    title: "Handwoven Persian Tabriz Rug",
    description:
      "A finely knotted Tabriz rug featuring an intricate central medallion in deep reds and ivory. Hand-woven by skilled artisans using traditional Persian techniques passed down through generations, it brings timeless elegance to any room.",
    categoryName: "Persian Rugs",
    sizes: [
      { value: 5, unit: "ft" },
      { value: 8, unit: "ft" },
    ],
    imageQueries: [
      ["persian tabriz rug", "persian rug", "rug"],
      ["rug weave texture close up", "rug texture", "carpet texture"],
    ],
    homepageSection: "bestselling",
  },
  {
    title: "Antique Persian Kashan Medallion Rug",
    description:
      "This antique-style Kashan rug showcases a bold floral medallion set against a rich burgundy field. Densely knotted for durability, it's a statement piece suited to formal living rooms and dining spaces alike.",
    categoryName: "Persian Rugs",
    sizes: [
      { value: 6, unit: "ft" },
      { value: 9, unit: "ft" },
    ],
    imageQueries: [
      ["persian kashan rug", "persian rug", "rug"],
      ["rug medallion pattern", "rug pattern detail", "carpet pattern"],
    ],
    homepageSection: "curated",
  },
  {
    title: "Persian Heriz Wool Area Rug",
    description:
      "Woven from hand-spun wool in the Heriz tradition, this rug pairs geometric motifs with a warm, earthy palette. Its sturdy weave makes it equally at home in high-traffic hallways or a cozy study.",
    categoryName: "Persian Rugs",
    sizes: [
      { value: 4, unit: "ft" },
      { value: 6, unit: "ft" },
      { value: 8, unit: "ft" },
    ],
    imageQueries: [
      ["persian heriz rug", "persian rug", "rug"],
      ["wool rug texture", "wool carpet texture", "rug texture"],
    ],
    homepageSection: "spotlight",
  },
  {
    title: "Nordic Minimalist Wool Rug",
    description:
      "A pared-back, Scandinavian-inspired rug in undyed natural wool tones. Its subtle texture and clean lines make it a versatile foundation for modern and minimalist interiors.",
    categoryName: "Modern Rugs",
    sizes: [
      { value: 5, unit: "ft" },
      { value: 7, unit: "ft" },
    ],
    imageQueries: [
      ["scandinavian wool rug", "modern area rug", "area rug"],
      ["rug texture close up", "wool texture", "carpet texture"],
    ],
    homepageSection: "bestselling",
  },
  {
    title: "Geometric Abstract Area Rug",
    description:
      "Bold geometric shapes in a contemporary colour palette give this rug real presence underfoot. A great way to anchor a modern living room or add graphic interest to a neutral space.",
    categoryName: "Modern Rugs",
    sizes: [
      { value: 4, unit: "ft" },
      { value: 6, unit: "ft" },
    ],
    imageQueries: [
      ["geometric area rug", "modern rug pattern", "area rug"],
      ["rug pattern detail", "carpet pattern", "rug texture"],
    ],
    homepageSection: "spotlight",
  },
  {
    title: "Charcoal Grey Shag Rug",
    description:
      "Deep, plush pile in a versatile charcoal grey makes this shag rug an easy way to add warmth and softness to any modern room. Deliciously soft underfoot and easy to style around.",
    categoryName: "Modern Rugs",
    sizes: [
      { value: 5, unit: "ft" },
      { value: 8, unit: "ft" },
    ],
    imageQueries: [
      ["grey shag rug", "shag rug", "area rug"],
      ["shag rug texture", "plush rug texture", "carpet texture"],
    ],
    homepageSection: "spotlight",
  },
  {
    title: "Handloomed Turkish Kilim Runner",
    description:
      "A flatwoven kilim runner in classic Turkish geometric motifs, handloomed from dyed wool. Lightweight and reversible, it's ideal for hallways, entryways, or layered over a larger rug.",
    categoryName: "Kilims",
    sizes: [
      { value: 2, unit: "ft" },
      { value: 6, unit: "ft" },
    ],
    imageQueries: [
      ["turkish kilim rug", "kilim pattern rug", "kilim"],
      ["kilim weave pattern", "flatweave pattern", "rug pattern detail"],
    ],
    homepageSection: "bestselling",
  },
  {
    title: "Flatwoven Anatolian Kilim Rug",
    description:
      "Woven using a traditional flatweave technique from the Anatolian region, this kilim features bold stripes and diamond motifs in warm, sun-faded tones. A durable, budget-friendly way to bring artisanal character into a room.",
    categoryName: "Kilims",
    sizes: [
      { value: 4, unit: "ft" },
      { value: 6, unit: "ft" },
    ],
    imageQueries: [
      ["anatolian kilim", "kilim pattern rug", "kilim"],
      ["flatweave rug texture", "kilim texture", "rug texture"],
    ],
    homepageSection: "curated",
  },
  {
    title: "Vintage Distressed Overdyed Rug",
    description:
      "A one-of-a-kind vintage rug reworked with an overdye technique for a faded, lived-in look. The distressed finish and muted tones make it a favourite for eclectic and bohemian interiors.",
    categoryName: "Vintage Rugs",
    sizes: [
      { value: 5, unit: "ft" },
      { value: 7, unit: "ft" },
      { value: 9, unit: "ft" },
    ],
    imageQueries: [
      ["vintage overdyed rug", "vintage rug", "rug"],
      ["distressed rug texture", "faded rug texture", "carpet texture"],
    ],
    homepageSection: "spotlight",
  },
  {
    title: "Faded Vintage Bohemian Rug",
    description:
      "Softly faded colours and an intricate all-over pattern give this vintage-style rug an heirloom quality from day one. A warm, characterful addition to a bohemian or eclectic living space.",
    categoryName: "Vintage Rugs",
    sizes: [
      { value: 4, unit: "ft" },
      { value: 6, unit: "ft" },
    ],
    imageQueries: [
      ["vintage bohemian rug", "vintage rug", "rug"],
      ["faded rug pattern", "vintage rug pattern", "rug pattern detail"],
    ],
    homepageSection: null,
  },
];

interface CreatedProductSummary {
  title: string;
  category: string;
  homepageSection: string | null;
  imageCount: number;
  slug: string;
}

async function createProducts(
  token: string,
  categoryIdsByName: Record<string, string>
): Promise<CreatedProductSummary[]> {
  console.log("\n=== Products ===");
  const created: CreatedProductSummary[] = [];

  for (const plan of PRODUCT_PLANS) {
    const categoryId = categoryIdsByName[plan.categoryName];
    if (!categoryId) {
      console.error(`- Skipping "${plan.title}" — category "${plan.categoryName}" was not created/found.`);
      continue;
    }

    console.log(`- Creating "${plan.title}"...`);
    const images: FetchedImage[] = [];
    for (const queries of plan.imageQueries) {
      const image = await fetchImage(queries);
      if (image) {
        images.push(image);
      } else {
        console.warn(`  No image found for one of "${plan.title}"'s image slots after all fallbacks — skipping that slot.`);
      }
    }

    const form = new FormData();
    form.append("title", plan.title);
    form.append("description", plan.description);
    form.append("category", categoryId);
    form.append("sizes", JSON.stringify(plan.sizes));
    if (plan.homepageSection) form.append("homepageSection", plan.homepageSection);
    for (const image of images) {
      form.append("images", toBlob(image), image.filename);
    }

    try {
      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: authHeaders(token),
        body: form,
      });
      if (!res.ok) {
        console.error(`  Failed to create "${plan.title}": ${res.status} ${await res.text()}`);
        continue;
      }
      const product = (await res.json()) as { slug: string };
      created.push({
        title: plan.title,
        category: plan.categoryName,
        homepageSection: plan.homepageSection,
        imageCount: images.length,
        slug: product.slug,
      });
      console.log(`  Created (${images.length} image${images.length === 1 ? "" : "s"}, section: ${plan.homepageSection || "none"}).`);
    } catch (err) {
      console.error(`  Failed to create "${plan.title}": ${(err as Error).message} — continuing with the rest.`);
    }
  }

  return created;
}

// ---- Services ----

interface ServiceStep {
  title: string;
  description: string;
}

interface ServicePlan {
  slug: "installation" | "fixing" | "delivery";
  title: string;
  intro: string;
  steps: ServiceStep[];
  imageQueries: string[];
}

const SERVICE_PLANS: ServicePlan[] = [
  {
    slug: "installation",
    title: "Installation",
    intro:
      "Our installation team measures, fits and finishes every rug in person, so it looks and feels exactly right from the moment we're done.",
    steps: [
      {
        title: "Measuring & site visit",
        description:
          "We visit (or ask you to send) accurate measurements of the room, so the size, shape and orientation are right for your space from the start.",
      },
      {
        title: "Preparing the space",
        description:
          "We check the floor and surrounding furniture, clear a path for delivery, and prepare an even, clean surface so the rug will sit flat and secure.",
      },
      {
        title: "Laying & fitting",
        description:
          "Our installers lay, align and, where needed, trim or pad the piece so it fits the room precisely — from a single statement rug to wall-to-wall carpet.",
      },
      {
        title: "Final walkthrough",
        description:
          "We walk the finished room with you, checking placement and edges, and make any last adjustments on the spot before we consider the job done.",
      },
    ],
    imageQueries: ["carpet installation worker", "carpet installation", "flooring installation"],
  },
  {
    slug: "fixing",
    title: "Fixing",
    intro:
      "A worn edge or a damaged corner doesn't mean the end of a rug's story. Our restoration team repairs what can be repaired, by hand, so a well-loved piece keeps its place in your home.",
    steps: [
      {
        title: "Inspection & assessment",
        description:
          "We examine the rug in person or from photos you send us, checking the pile, edges, backing and the extent of any damage.",
      },
      {
        title: "Repair method",
        description:
          "Depending on what's needed, our craftspeople re-bind worn edges, patch or re-weave damaged sections, and restore colour so the repair blends into the piece.",
      },
      {
        title: "Quality check",
        description:
          "Every repair passes our own quality check for strength and appearance before the rug is considered ready to go back down on the floor.",
      },
    ],
    imageQueries: ["rug repair craftsman", "textile repair", "fabric repair sewing"],
  },
  {
    slug: "delivery",
    title: "Delivery",
    intro:
      "A hand-knotted rug takes real craftsmanship to make — the last thing it needs is careless handling on the way to you. Every order is packaged, tracked and delivered with care.",
    steps: [
      {
        title: "Careful packing",
        description:
          "Every piece is rolled, wrapped and padded to protect the weave, colour and fringes for the journey ahead.",
      },
      {
        title: "Transport",
        description:
          "Once your order is dispatched, it's tracked in transit so you always know exactly when to expect it.",
      },
      {
        title: "Doorstep delivery",
        description:
          "Our team delivers to your door and, on request, helps unroll and position the piece in the room.",
      },
    ],
    imageQueries: ["furniture delivery truck", "delivery truck warehouse", "logistics delivery"],
  },
];

interface ExistingService {
  slug: string;
  title: string;
  intro: string;
  steps: unknown[];
}

async function createServices(token: string): Promise<{ created: string[]; skipped: string[] }> {
  console.log("\n=== Services ===");
  const res = await fetch(`${BASE_URL}/services/admin/all`, { headers: authHeaders(token) });
  const existing = (await res.json()) as ExistingService[];
  const existingBySlug = new Map(existing.map((s) => [s.slug, s]));

  const created: string[] = [];
  const skipped: string[] = [];

  for (const plan of SERVICE_PLANS) {
    const already = existingBySlug.get(plan.slug);
    const hasRealContent = already && already.intro?.trim() && already.steps?.length > 0;
    if (hasRealContent) {
      console.log(`- "${plan.slug}" already has real content, skipped.`);
      skipped.push(plan.slug);
      continue;
    }

    console.log(`- Creating "${plan.slug}"...`);
    const image = await fetchImage(plan.imageQueries);
    if (!image) {
      console.warn(`  No image found for "${plan.slug}" after all fallbacks — creating without an image.`);
    }

    const form = new FormData();
    form.append("title", plan.title);
    form.append("intro", plan.intro);
    form.append("steps", JSON.stringify(plan.steps));
    if (image) form.append("image", toBlob(image), image.filename);

    try {
      const createRes = await fetch(`${BASE_URL}/services`, {
        method: "POST",
        headers: authHeaders(token),
        body: form,
      });
      if (!createRes.ok) {
        console.error(`  Failed to create "${plan.slug}": ${createRes.status} ${await createRes.text()}`);
        continue;
      }
      created.push(plan.slug);
      console.log(`  Created.`);
    } catch (err) {
      console.error(`  Failed to create "${plan.slug}": ${(err as Error).message} — continuing with the rest.`);
    }
  }

  return { created, skipped };
}

// ---- Main ----

async function main(): Promise<void> {
  const healthCheck = await fetch(`${BASE_URL}/categories`).catch(() => null);
  if (!healthCheck || !healthCheck.ok) {
    console.error(`Backend doesn't appear to be running at ${BASE_URL} — start it first (npm run dev) and retry.`);
    process.exit(1);
  }

  fs.writeFileSync(
    ATTRIBUTION_LOG_PATH,
    `# Demo content image attribution log — generated ${new Date().toISOString()}\n` +
      `# All images sourced from Openverse (https://openverse.org), filtered to CC0 / PDM / BY / BY-SA licenses.\n\n`,
    "utf8"
  );

  console.log(`Logging in as ${ADMIN_EMAIL}...`);
  const token = await login();
  console.log("Logged in.");

  const categoryIdsByName = await getOrCreateCategories(token);
  const createdProducts = await createProducts(token, categoryIdsByName);
  const { created: createdServices, skipped: skippedServices } = await createServices(token);

  console.log("\n=== Summary ===");
  console.log(`Categories available: ${Object.keys(categoryIdsByName).join(", ")}`);
  console.log(`Products created: ${createdProducts.length}/${PRODUCT_PLANS.length}`);
  for (const p of createdProducts) {
    console.log(`  - ${p.title} [${p.category}] section=${p.homepageSection || "none"} images=${p.imageCount} slug=${p.slug}`);
  }
  console.log(`Services created: ${createdServices.join(", ") || "none"}`);
  console.log(`Services skipped (already had real content): ${skippedServices.join(", ") || "none"}`);

  if (poorResultQueries.length > 0) {
    console.log("\nQueries that returned zero acceptable Openverse results at some fallback level (may need manual image review):");
    for (const q of poorResultQueries) console.log(`  - "${q}"`);
  }

  console.log(`\nImage attribution log written to: ${ATTRIBUTION_LOG_PATH}`);
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
