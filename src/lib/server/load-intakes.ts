import type { IntakeLane } from "@/lib/intake";
import { readOptionalClientKey } from "@/lib/server/client-key";
import { listClientIntakes } from "@/lib/server/intakes";
import type { PersistedIntake } from "@/lib/records";

export async function loadIntakesForRequest(lane?: IntakeLane): Promise<{
  intakes: PersistedIntake[];
  error: string | null;
}> {
  const key = await readOptionalClientKey();
  if (!key) return { intakes: [], error: null };
  try {
    return { intakes: await listClientIntakes(key, lane), error: null };
  } catch (error) {
    console.error(error);
    return {
      intakes: [],
      error:
        "Lessfret could not load records from GCP project devo-holding. Try again.",
    };
  }
}
