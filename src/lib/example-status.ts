import type { BoardStatus } from "@/lib/board-data";
import type { CoachingStatus } from "@/lib/coaching-data";

const KEY = "lessfret.example-status.v1";

const listeners = new Set<() => void>();
let cachedRaw = "";
let cached: Record<string, string> = {};

function emit() {
  for (const listener of listeners) listener();
}

function load() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY) ?? "";
    if (raw === cachedRaw) return cached;
    cachedRaw = raw;
    cached = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    return cached;
  } catch {
    cachedRaw = "";
    cached = {};
    return cached;
  }
}

export function subscribeExampleStatus(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readExampleStatus(): Record<string, string> {
  return load();
}

export function emptyExampleStatus(): Record<string, string> {
  return {};
}

export function setExampleStatus(id: string, status: BoardStatus | CoachingStatus) {
  const next = { ...load(), [id]: status };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  cachedRaw = "";
  load();
  emit();
}

export function clearExampleStatus() {
  window.localStorage.removeItem(KEY);
  cachedRaw = "";
  cached = {};
  emit();
}
