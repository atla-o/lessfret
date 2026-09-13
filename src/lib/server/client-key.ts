import { cookies } from "next/headers";
import { CLIENT_COOKIE, isClientKey } from "@/lib/gcp";

export async function ensureClientKey() {
  const store = await cookies();
  const existing = store.get(CLIENT_COOKIE)?.value;
  if (isClientKey(existing)) return existing;
  const key = crypto.randomUUID();
  store.set(CLIENT_COOKIE, key, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });
  return key;
}

export async function readOptionalClientKey() {
  const store = await cookies();
  const existing = store.get(CLIENT_COOKIE)?.value;
  return isClientKey(existing) ? existing : null;
}
