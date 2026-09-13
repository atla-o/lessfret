import {
  deleteClientIntake,
  jsonError,
  readClientKey,
  updateClientIntakeStatus,
} from "@/lib/server/intakes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const clientKey = readClientKey(request);
    const { id } = await context.params;
    const body = (await request.json()) as { status?: unknown };
    const intake = await updateClientIntakeStatus(clientKey, id, String(body.status ?? ""));
    return Response.json({ intake });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const clientKey = readClientKey(_request);
    const { id } = await context.params;
    await deleteClientIntake(clientKey, id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
