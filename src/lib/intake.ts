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
  id: string;
  lane: "coaching";
  name: string;
  contact: string;
  focus: CoachingFocus | "";
  conversation: string;
  acceptedScope: boolean;
  submittedAt: string;
};

export type CoordinationIntake = {
  id: string;
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
