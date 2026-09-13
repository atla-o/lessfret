import { CLIENT_COOKIE, CLIENT_HEADER } from "@/lib/gcp";
import type { IntakeLane } from "@/lib/intake";
import {
  createClientIntake,
  jsonError,
  listClientIntakes,
  parseIntakeInput,
  readClientKey,
} from "@/lib/server/intakes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function withClientCookie(response: Response, clientKey: string) {
  response.headers.append(
    "Set-Cookie",
    `${CLIENT_COOKIE}=${clientKey}; Path=/; SameSite=Lax; Max-Age=31536000`
  );
  return response;
}

export async function GET(request: Request) {
  try {
    const clientKey = readClientKey(request);
    const lane = new URL(request.url).searchParams.get("lane");
    if (lane && lane !== "coaching" && lane !== "coordination") {
      return Response.json({ error: "Unknown lane." }, { status: 400 });
    }
    const intakes = await listClientIntakes(clientKey, (lane as IntakeLane) || undefined);
    return withClientCookie(Response.json({ intakes }), clientKey);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const clientKey = readClientKey(request);
    const body = await request.json();
    const input = parseIntakeInput(body);
    const intake = await createClientIntake(clientKey, input);
    return withClientCookie(
      Response.json({ intake }, { status: 201, headers: { [CLIENT_HEADER]: clientKey } }),
      clientKey
    );
  } catch (error) {
    return jsonError(error);
  }
}
