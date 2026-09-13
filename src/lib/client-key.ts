import { CLIENT_COOKIE, CLIENT_STORAGE_KEY } from "@/lib/gcp";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function persistCookie(key: string) {
  document.cookie = `${CLIENT_COOKIE}=${key}; Path=/; SameSite=Lax; Max-Age=31536000`;
}

export function getClientKey() {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(CLIENT_STORAGE_KEY);
  if (existing && isUuid(existing)) {
    persistCookie(existing);
    return existing;
  }
  const key = crypto.randomUUID();
  window.localStorage.setItem(CLIENT_STORAGE_KEY, key);
  persistCookie(key);
  return key;
}
