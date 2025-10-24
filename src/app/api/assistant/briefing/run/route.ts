import { NextRequest } from "next/server";
import { createBriefingFromToolCall } from "@/lib/assistant/renderers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const type = body.type ?? "morning";
  const toolCall = { id: `brief-${type}`, tool: "briefing", payload: { type } };
  const sections = createBriefingFromToolCall(toolCall);
  return Response.json({ sections });
}
