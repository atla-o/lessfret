import { FieldValue, type DocumentData } from "@google-cloud/firestore";
import { statusOrder, type BoardStatus } from "@/lib/board-data";
import { coachingStatusOrder, type CoachingStatus } from "@/lib/coaching-data";
import { CLIENT_COOKIE, CLIENT_HEADER } from "@/lib/gcp";
import {
  coachingFocusLabels,
  needLabels,
  pathwayLabels,
  type CoachingFocus,
  type CoordinationNeed,
  type CoordinationPathway,
  type IntakeLane,
} from "@/lib/intake";
import type {
  IntakeWriteInput,
  PersistedCoaching,
  PersistedCoordination,
  PersistedIntake,
} from "@/lib/records";
import { intakesCollection } from "@/lib/server/firestore";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function cookieValue(header: string | null, name: string) {
  if (!header) return null;
  const parts = header.split(";").map((part) => part.trim());
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) return part.slice(name.length + 1);
  }
  return null;
}

export function readClientKey(request: Request) {
  const header = request.headers.get(CLIENT_HEADER)?.trim() ?? "";
  const cookie = cookieValue(request.headers.get("cookie"), CLIENT_COOKIE)?.trim() ?? "";
  const key = header || cookie;
  if (!isUuid(key)) {
    throw new ApiError(401, "Open Lessfret in a browser that can keep a client key.");
  }
  return key;
}

function trim(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function requireText(value: unknown, label: string, min: number, max: number) {
  const text = trim(value, max);
  if (text.length < min) {
    throw new ApiError(400, `${label} is required.`);
  }
  return text;
}

const coachingFocuses = Object.keys(coachingFocusLabels) as CoachingFocus[];
const pathways = Object.keys(pathwayLabels) as CoordinationPathway[];
const needs = Object.keys(needLabels) as CoordinationNeed[];

function parseCoaching(body: Record<string, unknown>): Omit<PersistedCoaching, "id"> {
  const focus = trim(body.focus, 40) as CoachingFocus;
  if (!coachingFocuses.includes(focus)) {
    throw new ApiError(400, "Choose a coaching focus.");
  }
  return {
    lane: "coaching",
    name: requireText(body.name, "Name", 1, 80),
    contact: requireText(body.contact, "Contact", 1, 200),
    focus,
    conversation: requireText(body.conversation, "Conversation note", 12, 4000),
    acceptedScope: body.acceptedScope === true,
    submittedAt: new Date().toISOString(),
    status: "requested",
    updatedAt: new Date().toISOString(),
  };
}

function parseCoordination(
  body: Record<string, unknown>
): Omit<PersistedCoordination, "id"> {
  const pathway = trim(body.pathway, 40) as CoordinationPathway;
  if (!pathways.includes(pathway)) {
    throw new ApiError(400, "Choose a coordination pathway.");
  }
  const selected = Array.isArray(body.needs)
    ? body.needs.filter((need): need is CoordinationNeed =>
        needs.includes(need as CoordinationNeed)
      )
    : [];
  if (selected.length === 0) {
    throw new ApiError(400, "Select at least one coordination need.");
  }
  return {
    lane: "coordination",
    name: requireText(body.name, "Name", 1, 80),
    contact: requireText(body.contact, "Contact", 1, 200),
    pathway,
    needs: selected,
    situation: requireText(body.situation, "Situation note", 12, 4000),
    providers: trim(body.providers, 1000),
    acceptedScope: body.acceptedScope === true,
    submittedAt: new Date().toISOString(),
    status: "requested",
    updatedAt: new Date().toISOString(),
  };
}

export function parseIntakeInput(body: unknown): IntakeWriteInput & {
  status: PersistedIntake["status"];
  submittedAt: string;
  updatedAt: string;
} {
  if (!body || typeof body !== "object") {
    throw new ApiError(400, "Send a JSON request body.");
  }
  const record = body as Record<string, unknown>;
  if (record.acceptedScope !== true) {
    throw new ApiError(400, "Accept the scope note.");
  }
  if (record.lane === "coaching") return parseCoaching(record);
  if (record.lane === "coordination") return parseCoordination(record);
  throw new ApiError(400, "Choose coaching or coordination.");
}

export function parseStatus(lane: IntakeLane, status: unknown) {
  if (typeof status !== "string") {
    throw new ApiError(400, "Status is required.");
  }
  if (lane === "coaching") {
    if (!coachingStatusOrder.includes(status as CoachingStatus)) {
      throw new ApiError(400, "That coaching status is not used.");
    }
    return status as CoachingStatus;
  }
  if (!statusOrder.includes(status as BoardStatus)) {
    throw new ApiError(400, "That coordination status is not used.");
  }
  return status as BoardStatus;
}

function asPersisted(id: string, data: DocumentData): PersistedIntake {
  const rest = { ...data };
  delete rest.clientKey;
  delete rest.createdAt;
  return { ...rest, id } as PersistedIntake;
}

async function withTimeout<T>(promise: Promise<T>, ms = 8000) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_resolve, reject) => {
        timer = setTimeout(() => {
          reject(new Error("Firestore in GCP project devo-holding timed out."));
        }, ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function listClientIntakes(clientKey: string, lane?: IntakeLane) {
  const snapshot = await withTimeout(
    intakesCollection().where("clientKey", "==", clientKey).get()
  );
  const intakes = snapshot.docs
    .map((doc) => asPersisted(doc.id, doc.data()))
    .filter((item) => (lane ? item.lane === lane : true))
    .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
  return intakes;
}

export async function createClientIntake(
  clientKey: string,
  input: ReturnType<typeof parseIntakeInput>
) {
  const ref = intakesCollection().doc();
  const record = {
    ...input,
    clientKey,
    createdAt: FieldValue.serverTimestamp(),
  };
  await withTimeout(ref.set(record));
  return asPersisted(ref.id, { ...input, clientKey });
}

export async function updateClientIntakeStatus(
  clientKey: string,
  id: string,
  status: string
) {
  const ref = intakesCollection().doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new ApiError(404, "That request was not found.");
  const data = snap.data();
  if (!data || data.clientKey !== clientKey) {
    throw new ApiError(404, "That request was not found.");
  }
  const nextStatus = parseStatus(data.lane as IntakeLane, status);
  const updatedAt = new Date().toISOString();
  await ref.update({ status: nextStatus, updatedAt });
  return asPersisted(id, { ...data, status: nextStatus, updatedAt });
}

export async function deleteClientIntake(clientKey: string, id: string) {
  const ref = intakesCollection().doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new ApiError(404, "That request was not found.");
  const data = snap.data();
  if (!data || data.clientKey !== clientKey) {
    throw new ApiError(404, "That request was not found.");
  }
  await ref.delete();
}

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return Response.json(
    {
      error:
        "Lessfret could not reach records in GCP project devo-holding. Try again.",
    },
    { status: 503 }
  );
}
