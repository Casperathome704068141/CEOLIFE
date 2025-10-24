import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const schedule = body.payload?.schedule ?? {};
  return Response.json({
    ok: true,
    id: `event-${Date.now()}`,
    summary: `Scheduled ${schedule.title ?? "event"}`,
    undoable: true,
    deepLink: "/schedule/calendar",
  });
}
