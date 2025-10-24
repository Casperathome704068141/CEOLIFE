import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return Response.json({
    ok: true,
    id: `goal-${Date.now()}`,
    summary: "Goal funded",
    undoable: false,
  });
}
