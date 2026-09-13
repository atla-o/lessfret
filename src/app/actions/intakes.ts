"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ApiError,
  createClientIntake,
  deleteClientIntake,
  parseIntakeInput,
  parseStatus,
  updateClientIntakeStatus,
} from "@/lib/server/intakes";
import { ensureClientKey } from "@/lib/server/client-key";
import type { IntakeLane } from "@/lib/intake";

export type IntakeActionState = {
  error: string | null;
  invalid: boolean;
};

function formRecord(formData: FormData): Record<string, unknown> {
  const needs = formData.getAll("needs").map(String);
  return {
    lane: String(formData.get("lane") ?? ""),
    name: String(formData.get("name") ?? ""),
    contact: String(formData.get("contact") ?? ""),
    focus: String(formData.get("focus") ?? ""),
    conversation: String(formData.get("conversation") ?? ""),
    pathway: String(formData.get("pathway") ?? ""),
    needs,
    situation: String(formData.get("situation") ?? ""),
    providers: String(formData.get("providers") ?? ""),
    acceptedScope: formData.get("acceptedScope") === "on",
  };
}

function actionError(error: unknown): IntakeActionState {
  if (error instanceof ApiError) {
    return { error: error.message, invalid: error.status === 400 };
  }
  console.error(error);
  return {
    error:
      "Lessfret could not save this request in GCP project devo-holding. Try again.",
    invalid: false,
  };
}

function revalidateBoards() {
  revalidatePath("/coaching");
  revalidatePath("/board");
  revalidatePath("/intake");
}

export async function submitCoachingIntake(
  _prev: IntakeActionState | null,
  formData: FormData
): Promise<IntakeActionState> {
  try {
    const clientKey = await ensureClientKey();
    const input = parseIntakeInput({ ...formRecord(formData), lane: "coaching" });
    await createClientIntake(clientKey, input);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return actionError(error);
  }
  revalidateBoards();
  redirect("/coaching?saved=1");
}

export async function submitCoordinationIntake(
  _prev: IntakeActionState | null,
  formData: FormData
): Promise<IntakeActionState> {
  try {
    const clientKey = await ensureClientKey();
    const input = parseIntakeInput({
      ...formRecord(formData),
      lane: "coordination",
    });
    await createClientIntake(clientKey, input);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return actionError(error);
  }
  revalidateBoards();
  redirect("/board?saved=1");
}

export async function changeSavedStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const lane = String(formData.get("lane") ?? "") as IntakeLane;
  const status = String(formData.get("status") ?? "");
  const clientKey = await ensureClientKey();
  parseStatus(lane, status);
  await updateClientIntakeStatus(clientKey, id, status);
  revalidateBoards();
}

export async function removeSavedRequest(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const clientKey = await ensureClientKey();
  await deleteClientIntake(clientKey, id);
  revalidateBoards();
}
