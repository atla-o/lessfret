export type IntakeLane = "coaching" | "coordination";

export type CoachingFocus =
  | "direction"
  | "work"
  | "relationships"
  | "habits"
  | "fertility-adjacent"
  | "other";

export type CoordinationPathway =
  | "fertility"
  | "diagnostics"
  | "general"
  | "other";

export type CoordinationNeed =
  | "referral"
  | "scheduling"
  | "records"
  | "prep"
  | "follow-up";

export type CoachingIntake = {
  lane: "coaching";
  name: string;
  contact: string;
  focus: CoachingFocus | "";
  conversation: string;
  acceptedScope: boolean;
  submittedAt: string;
};

export type CoordinationIntake = {
  lane: "coordination";
  name: string;
  contact: string;
  pathway: CoordinationPathway | "";
  needs: CoordinationNeed[];
  situation: string;
  providers: string;
  acceptedScope: boolean;
  submittedAt: string;
};

export type StoredIntake = CoachingIntake | CoordinationIntake;

export const INTAKE_STORAGE_KEY = "lessfret.intake.v1";

const intakeListeners = new Set<() => void>();

function emitIntake() {
  for (const listener of intakeListeners) listener();
}

export function subscribeIntake(listener: () => void) {
  intakeListeners.add(listener);
  return () => {
    intakeListeners.delete(listener);
  };
}

export const coachingFocusLabels: Record<CoachingFocus, string> = {
  direction: "Life direction and decisions",
  work: "Work, vocation, and burnout-adjacent stress",
  relationships: "Relationships and communication",
  habits: "Habits, routines, and follow-through",
  "fertility-adjacent":
    "Stress around fertility or health logistics (coaching only)",
  other: "Something else in the coaching lane",
};

export const pathwayLabels: Record<CoordinationPathway, string> = {
  fertility: "Fertility care navigation",
  diagnostics: "Diagnostics and testing logistics",
  general: "General health coordination",
  other: "Another care-navigation need",
};

export const needLabels: Record<CoordinationNeed, string> = {
  referral: "Finding or requesting a referral",
  scheduling: "Scheduling with a provider or facility",
  records: "Gathering or sending records",
  prep: "Preparing questions or visit materials",
  "follow-up": "Tracking follow-ups after a visit",
};

let cachedRaw: string | null = null;
let cachedValue: StoredIntake | null = null;

export function readIntake(): StoredIntake | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(INTAKE_STORAGE_KEY);
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    cachedValue = raw ? (JSON.parse(raw) as StoredIntake) : null;
    return cachedValue;
  } catch {
    cachedRaw = null;
    cachedValue = null;
    return null;
  }
}

export function writeIntake(intake: StoredIntake) {
  const raw = JSON.stringify(intake);
  sessionStorage.setItem(INTAKE_STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedValue = intake;
  emitIntake();
}

export function clearIntake() {
  sessionStorage.removeItem(INTAKE_STORAGE_KEY);
  cachedRaw = null;
  cachedValue = null;
  emitIntake();
}

export function simulateSubmit(fail = false) {
  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => {
      if (fail) reject(new Error("Could not save this intake. Try again."));
      else resolve();
    }, 700);
  });
}
