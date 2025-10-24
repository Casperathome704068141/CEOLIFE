import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ ok: true, provider: "drive", connected: true });
}
