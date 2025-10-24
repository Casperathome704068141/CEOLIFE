import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const idempotencyKey: string = body.idempotencyKey ?? "unknown";
  return Response.json({
    ok: true,
    id: `txn-${Date.now()}`,
    summary: "Transaction recorded",
    undoable: true,
    idempotencyKey,
  });
}
