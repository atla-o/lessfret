import { CLIENT_HEADER } from "@/lib/gcp";
import { getClientKey } from "@/lib/client-key";
import type { IntakeWriteInput, PersistedIntake } from "@/lib/records";
import type { IntakeLane } from "@/lib/intake";

async function parseError(response: Response) {
  try {
    const body = (await response.json()) as { error?: string };
    if (body.error) return body.error;
  } catch {
    /* ignore */
  }
  return `Request failed (${response.status}).`;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set(CLIENT_HEADER, getClientKey());
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 10000);
  let response: Response;
  try {
    response = await window.fetch(path, {
      ...init,
      headers,
      cache: "no-store",
      credentials: "same-origin",
      signal: init.signal ?? controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "Lessfret took too long to reach records in GCP project devo-holding."
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function listIntakes(lane?: IntakeLane) {
  const query = lane ? `?lane=${lane}` : "";
  return request<{ intakes: PersistedIntake[] }>(`/api/intakes${query}`);
}

export function createIntake(input: IntakeWriteInput) {
  return request<{ intake: PersistedIntake }>("/api/intakes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateIntakeStatus(id: string, status: string) {
  return request<{ intake: PersistedIntake }>(`/api/intakes/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteIntake(id: string) {
  return request<void>(`/api/intakes/${id}`, { method: "DELETE" });
}
