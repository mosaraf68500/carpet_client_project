// Single source of truth for calling the Doha Carpet backend from the
// public frontend. Public endpoints only — no auth headers, no token (see
// dashboard/src/lib/api.js for the admin-side equivalent, which does need
// those). Paths below are verified against the real route files
// (category.routes.ts / product.routes.ts / service.routes.ts /
// contact.routes.ts), not assumed.

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    next: { revalidate: 60 }, // ISR: background-revalidate every 60s, no client spinners
  });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }
  return data;
}

// ---- Categories ----

// params: { parent } — omit for everything flat, "root"/"null" for
// top-level only, or a category _id for that category's direct children.
export function getCategories(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/categories${qs ? `?${qs}` : ""}`);
}

export function getCategoryBySlug(slug) {
  return request(`/categories/${slug}`);
}

// Groups a flat category list into { ...topLevelCategory, children: [...] }.
// Verified against the real API (not assumed): the LIST endpoint
// (GET /categories, used here) always returns `parentCategory` as a raw id
// string (or null) — never populated. Only GET /categories/:slug (a single
// category) populates it as { _id, name, slug }. This only ever receives
// list-endpoint data, so it compares against the raw id directly.
export function buildCategoryTree(categories) {
  const topLevel = categories.filter((c) => !c.parentCategory);
  return topLevel.map((top) => ({
    ...top,
    children: categories.filter((c) => c.parentCategory === top._id),
  }));
}

// ---- Products ----

export function getProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/products${qs ? `?${qs}` : ""}`);
}

export function getProductBySlug(slug) {
  return request(`/products/${slug}`);
}

// Navbar live-search dropdown. Backend does a case-insensitive partial
// match on title/description and ignores `search` entirely below 2
// characters (falls back to the regular listing) — callers should still
// debounce and gate on length client-side rather than relying on that.
export function searchProducts(query, { limit = 6 } = {}) {
  return getProducts({ search: query, limit });
}

// Loops through every page since a single call's `limit` can't be assumed
// to cover the whole catalog. For places that need the full product list
// (sitemap generation, static param generation) — not for paginated UI
// views, which should keep using getProducts directly.
export async function getAllProducts() {
  const first = await getProducts({ page: 1, limit: 100 });
  const items = [...first.items];
  for (let page = 2; page <= first.totalPages; page++) {
    const next = await getProducts({ page, limit: 100 });
    items.push(...next.items);
  }
  return items;
}

// ---- Services ----

export function getServiceBySlug(slug) {
  return request(`/services/${slug}`);
}

// ---- Contact ----

// `source` tells the backend which frontend form this came from
// ("contact" or "quote") so the dashboard's Messages inbox can tell them
// apart. Defaults to "contact" since ContactForm is the plain inquiry form.
export function submitContact(payload, source = "contact") {
  return request("/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, source }),
  });
}

// ---- Appointments ----

export function submitAppointment(payload) {
  return request("/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ---- Settings ----

// GET /api/settings is public (no auth middleware on that route) — safe to
// call from here. Returns { phone, landline, whatsapp, email, address },
// all plain strings; phone/whatsapp are digits-only (for tel:/wa.me links).
export function getSettings() {
  return request("/settings");
}
