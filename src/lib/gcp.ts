/** GCP project that holds Lessfret app data. Spell carefully. */
export const GCP_PROJECT_ID = "devo-holding";

export const FIRESTORE_DATABASE_ID = "(default)";
export const INTAKES_COLLECTION = "lessfret_intakes";
export const CLIENT_HEADER = "x-lessfret-client";
export const CLIENT_COOKIE = "lessfret_client";
export const CLIENT_STORAGE_KEY = "lessfret.client.v1";

export function isClientKey(value: string | undefined | null): value is string {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value ?? ""
  );
}
