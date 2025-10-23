import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

interface NudgeRequest {
  to: string;
  channel: "whatsapp" | "sms";
  message?: string;
  template?: string;
  listId?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as NudgeRequest;
  if (!body.to) {
    return NextResponse.json({ error: "Missing recipient" }, { status: 400 });
  }

  const id = randomUUID();
  console.info("[nudge]", { id, ...body });

  return NextResponse.json({ id, status: "queued" });
}
