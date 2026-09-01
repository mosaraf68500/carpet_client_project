// Single source of truth for calling the Doha Furniture admin API.
// No other file in this project should call fetch() directly against the
// backend — import the functions below instead, so auth headers, error
// handling, and the base URL only ever need to be maintained in one place.

import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, options = {}) {
  const { body, isFormData, headers, ...rest } = options;
  const token = getToken();

  const finalHeaders = { ...headers };
  if (!isFormData) {
    finalHeaders["Content-Type"] = "application/json";
  }
  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
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

export function createCategory(formData) {
  return request("/categories", { method: "POST", body: formData, isFormData: true });
}

export function updateCategory(id, formData) {
  return request(`/categories/${id}`, { method: "PUT", body: formData, isFormData: true });
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

export function createProduct(formData) {
  return request("/products", { method: "POST", body: formData, isFormData: true });
}

export function updateProduct(id, formData) {
  return request(`/products/${id}`, { method: "PUT", body: formData, isFormData: true });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: "DELETE" });
}

// ---- Services ----

export function getAdminServices() {
  return request("/services/admin/all", { method: "GET" });
}

export function createService(formData) {
  return request("/services", { method: "POST", body: formData, isFormData: true });
}

export function updateService(id, formData) {
  return request(`/services/${id}`, { method: "PUT", body: formData, isFormData: true });
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

// ---- Settings ----

export function getSettings() {
  return request("/settings", { method: "GET" });
}

export function updateSettings(payload) {
  return request("/settings", { method: "PUT", body: payload });
}
