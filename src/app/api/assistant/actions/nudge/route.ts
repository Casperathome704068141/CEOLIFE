import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return Response.json({
    ok: true,
    id: `nudge-${Date.now()}`,
    summary: "Nudge delivered",
    undoable: false,
  });
}
