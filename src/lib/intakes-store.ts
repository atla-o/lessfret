import type { IntakeLane } from "@/lib/intake";
import {
  createIntake,
  deleteIntake,
  listIntakes,
  updateIntakeStatus,
} from "@/lib/intakes-api";
import type { IntakeWriteInput, PersistedIntake } from "@/lib/records";

export type IntakesSnapshot = {
  intakes: PersistedIntake[];
  loading: boolean
  error: string | null;
};

const listeners = new Set<() => void>();

const emptySnapshot: IntakesSnapshot = {
  intakes: [],
  loading: true,
  error: null,
};

let snapshot: IntakesSnapshot = emptySnapshot;
let inflight: Promise<void> | null = null;

function emit() {
  for (const listener of listeners) listener();
}

function setSnapshot(next: IntakesSnapshot) {
  snapshot = next;
  emit();
}

export function subscribeIntakes(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getServerIntakes(): IntakesSnapshot {
  return emptySnapshot;
}

export function readIntakesSnapshot(): IntakesSnapshot {
  return snapshot;
}

export async function refreshIntakes(force = false) {
  if (inflight && !force) return inflight;
  setSnapshot({
    ...snapshot,
    loading: snapshot.intakes.length === 0,
    error: null,
  });
  inflight = listIntakes()
    .then((result) => {
      setSnapshot({ intakes: result.intakes, loading: false, error: null });
    })
    .catch((error: unknown) => {
      setSnapshot({
        intakes: snapshot.intakes,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not load saved requests.",
      });
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export async function submitIntake(input: IntakeWriteInput) {
  const result = await createIntake(input);
  setSnapshot({
    intakes: [
      result.intake,
      ...snapshot.intakes.filter((item) => item.id !== result.intake.id),
    ],
    loading: false,
    error: null,
  });
  return result.intake;
}

export async function changeIntakeStatus(id: string, status: string) {
  const previous = snapshot.intakes;
  setSnapshot({
    ...snapshot,
    intakes: previous.map((item) =>
      item.id === id
        ? ({ ...item, status, updatedAt: new Date().toISOString() } as PersistedIntake)
        : item
    ),
    error: null,
  });
  try {
    const result = await updateIntakeStatus(id, status);
    setSnapshot({
      ...snapshot,
      intakes: snapshot.intakes.map((item) =>
        item.id === id ? result.intake : item
      ),
    });
  } catch (error) {
    setSnapshot({
      intakes: previous,
      loading: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not update that request.",
    });
    throw error;
  }
}

export async function removeSavedIntake(id: string) {
  const previous = snapshot.intakes;
  setSnapshot({
    ...snapshot,
    intakes: previous.filter((item) => item.id !== id),
    error: null,
  });
  try {
    await deleteIntake(id);
  } catch (error) {
    setSnapshot({
      intakes: previous,
      loading: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not remove that request.",
    });
    throw error;
  }
}

export async function removeSavedLane(lane: IntakeLane) {
  const targets = snapshot.intakes.filter((item) => item.lane === lane);
  for (const item of targets) {
    await removeSavedIntake(item.id);
  }
}

export function saveErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Could not save this request to Lessfret. Try again.";
}
