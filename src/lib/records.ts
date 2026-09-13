import type { BoardStatus } from "@/lib/board-data";
import type { CoachingStatus } from "@/lib/coaching-data";
import type { CoachingIntake, CoordinationIntake } from "@/lib/intake";

export type PersistedCoaching = CoachingIntake & {
  status: CoachingStatus;
  updatedAt: string;
};

export type PersistedCoordination = CoordinationIntake & {
  status: BoardStatus;
  updatedAt: string;
};

export type PersistedIntake = PersistedCoaching | PersistedCoordination;

export type IntakeWriteInput =
  | Omit<CoachingIntake, "id" | "submittedAt">
  | Omit<CoordinationIntake, "id" | "submittedAt">;
