import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return Response.json({
    ok: true,
    id: `sim-${Date.now()}`,
    summary: "Simulation applied",
    undoable: false,
  });
}
