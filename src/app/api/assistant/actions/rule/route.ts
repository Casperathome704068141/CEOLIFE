import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return Response.json({
    ok: true,
    id: `rule-${Date.now()}`,
    summary: "Rule updated",
    undoable: true,
  });
}
