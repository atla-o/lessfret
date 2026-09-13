import type { BoardStatus } from "@/lib/board-data";
import type { CoachingStatus } from "@/lib/coaching-data";
import type { StoredIntake } from "@/lib/intake";

export const INTAKES_STORAGE_KEY = "lessfret.intakes.v2";
export const LEGACY_INTAKE_KEY = "lessfret.intake.v1";
export const BOARD_STATUS_KEY = "lessfret.board-status.v1";
export const COACHING_STATUS_KEY = "lessfret.coaching-status.v1";

export type SessionSnapshot = {
  intakes: StoredIntake[];
  boardStatus: Record<string, BoardStatus>;
  coachingStatus: Record<string, CoachingStatus>;
};

const listeners = new Set<() => void>();

const emptySnapshot: SessionSnapshot = {
  intakes: [],
  boardStatus: {},
  coachingStatus: {},
};

let cachedRaw = "";
let cachedSnapshot: SessionSnapshot = emptySnapshot;

function emit() {
  for (const listener of listeners) listener();
}

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function ensureId(intake: StoredIntake, fallback: string): StoredIntake {
  if (intake.id) return intake;
  return { ...intake, id: fallback };
}

function loadSnapshot(): SessionSnapshot {
  if (typeof window === "undefined") return emptySnapshot;

  try {
    const intakesRaw = sessionStorage.getItem(INTAKES_STORAGE_KEY);
    const legacyRaw = sessionStorage.getItem(LEGACY_INTAKE_KEY);
    const boardRaw = sessionStorage.getItem(BOARD_STATUS_KEY);
    const coachingRaw = sessionStorage.getItem(COACHING_STATUS_KEY);
    const fingerprint = `${intakesRaw ?? ""}|${legacyRaw ?? ""}|${boardRaw ?? ""}|${coachingRaw ?? ""}`;

    if (fingerprint === cachedRaw) return cachedSnapshot;

    let intakes = parseJson<StoredIntake[]>(intakesRaw, []);
    if (!Array.isArray(intakes)) intakes = [];

    if (legacyRaw && intakes.length === 0) {
      const legacy = parseJson<StoredIntake | null>(legacyRaw, null);
      if (legacy?.lane) {
        intakes = [
          ensureId(legacy, `legacy-${legacy.submittedAt || "intake"}`),
        ];
        sessionStorage.setItem(INTAKES_STORAGE_KEY, JSON.stringify(intakes));
        sessionStorage.removeItem(LEGACY_INTAKE_KEY);
      }
    }

    intakes = intakes
      .filter((item) => item && (item.lane === "coaching" || item.lane === "coordination"))
      .map((item, index) =>
        ensureId(item, `migrated-${item.submittedAt || index}`)
      );

    const snapshot: SessionSnapshot = {
      intakes,
      boardStatus: parseJson(boardRaw, {}),
      coachingStatus: parseJson(coachingRaw, {}),
    };

    cachedRaw = fingerprint;
    cachedSnapshot = snapshot;
    return snapshot;
  } catch {
    cachedRaw = "";
    cachedSnapshot = emptySnapshot;
    return emptySnapshot;
  }
}

function persistIntakes(intakes: StoredIntake[]) {
  const raw = JSON.stringify(intakes);
  sessionStorage.setItem(INTAKES_STORAGE_KEY, raw);
  sessionStorage.removeItem(LEGACY_INTAKE_KEY);
  cachedRaw = "";
  cachedSnapshot = loadSnapshot();
  emit();
}

function persistRecord(key: string, value: Record<string, string>) {
  sessionStorage.setItem(key, JSON.stringify(value));
  cachedRaw = "";
  cachedSnapshot = loadSnapshot();
  emit();
}

export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getServerSession(): SessionSnapshot {
  return emptySnapshot;
}

export function readSession(): SessionSnapshot {
  return loadSnapshot();
}

export function readIntakes(): StoredIntake[] {
  return loadSnapshot().intakes;
}

export function writeIntake(intake: StoredIntake) {
  const next = [intake, ...loadSnapshot().intakes.filter((item) => item.id !== intake.id)];
  persistIntakes(next);
}

export function removeIntake(id: string) {
  persistIntakes(loadSnapshot().intakes.filter((item) => item.id !== id));
}

export function clearIntakes(lane?: StoredIntake["lane"]) {
  if (!lane) {
    persistIntakes([]);
    return;
  }
  persistIntakes(loadSnapshot().intakes.filter((item) => item.lane !== lane));
}

export function setBoardStatus(id: string, status: BoardStatus) {
  persistRecord(BOARD_STATUS_KEY, {
    ...loadSnapshot().boardStatus,
    [id]: status,
  });
}

export function setCoachingStatus(id: string, status: CoachingStatus) {
  persistRecord(COACHING_STATUS_KEY, {
    ...loadSnapshot().coachingStatus,
    [id]: status,
  });
}

export function clearStatusOverrides(kind: "board" | "coaching" | "all" = "all") {
  if (kind === "board" || kind === "all") {
    sessionStorage.removeItem(BOARD_STATUS_KEY);
  }
  if (kind === "coaching" || kind === "all") {
    sessionStorage.removeItem(COACHING_STATUS_KEY);
  }
  cachedRaw = "";
  cachedSnapshot = loadSnapshot();
  emit();
}

export function createIntakeId() {
  return `lf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sessionSaveErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Could not save this note in the browser session. Try again.";
}
