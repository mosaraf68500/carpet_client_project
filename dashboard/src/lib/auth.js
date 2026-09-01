// Client-side JWT storage for the admin dashboard. The token is kept in
// localStorage so it survives page reloads but is only ever read in the
// browser (SSR/build passes get `null`, never a thrown error).

const TOKEN_KEY = "doha_admin_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}
