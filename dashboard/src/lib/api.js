// Single source of truth for calling the Doha Carpet admin API.
// No other file in this project should call fetch() directly against the
// backend — import the functions below instead, so auth headers, error
// handling, and the base URL only ever need to be maintained in one place.

import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Images now upload straight from the browser to Cloudinary (see
// lib/cloudinaryUpload.js) — every backend call here is a plain JSON
// request, so this no longer needs a FormData/upload-progress path.
async function request(path, options = {}) {
  const { body, headers, ...rest } = options;
  const token = getToken();

  const finalHeaders = { "Content-Type": "application/json", ...headers };
  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data;
}

// ---- Auth ----

export function login(email, password) {
  return request("/auth/login", { method: "POST", body: { email, password } });
}

export function getMe() {
  return request("/auth/me", { method: "GET" });
}

// ---- Categories ----

export function getCategories() {
  return request("/categories", { method: "GET" });
}

export function createCategory(payload) {
  return request("/categories", { method: "POST", body: payload });
}

export function updateCategory(id, payload) {
  return request(`/categories/${id}`, { method: "PUT", body: payload });
}

export function deleteCategory(id) {
  return request(`/categories/${id}`, { method: "DELETE" });
}

// ---- Products ----

export function getAdminProducts({ page, limit } = {}) {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  const query = params.toString();
  return request(`/products/admin/all${query ? `?${query}` : ""}`, { method: "GET" });
}

export function createProduct(payload) {
  return request("/products", { method: "POST", body: payload });
}

export function updateProduct(id, payload) {
  return request(`/products/${id}`, { method: "PUT", body: payload });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: "DELETE" });
}

// ---- Services ----

export function getAdminServices() {
  return request("/services/admin/all", { method: "GET" });
}

export function createService(payload) {
  return request("/services", { method: "POST", body: payload });
}

export function updateService(id, payload) {
  return request(`/services/${id}`, { method: "PUT", body: payload });
}

export function deleteService(id) {
  return request(`/services/${id}`, { method: "DELETE" });
}

// ---- Contact messages ----

export function getMessages({ page, limit, unreadOnly } = {}) {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  if (unreadOnly) params.set("unreadOnly", unreadOnly);
  const query = params.toString();
  return request(`/contact${query ? `?${query}` : ""}`, { method: "GET" });
}

export function markMessageRead(id) {
  return request(`/contact/${id}/read`, { method: "PATCH" });
}

export function deleteMessage(id) {
  return request(`/contact/${id}`, { method: "DELETE" });
}

// ---- Appointments ----

export function getAppointments({ page, limit } = {}) {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  const query = params.toString();
  return request(`/appointments${query ? `?${query}` : ""}`, { method: "GET" });
}

export function updateAppointmentStatus(id, status) {
  return request(`/appointments/${id}`, { method: "PATCH", body: { status } });
}

export function deleteAppointment(id) {
  return request(`/appointments/${id}`, { method: "DELETE" });
}

// ---- Settings ----

export function getSettings() {
  return request("/settings", { method: "GET" });
}

export function updateSettings(payload) {
  return request("/settings", { method: "PUT", body: payload });
}
