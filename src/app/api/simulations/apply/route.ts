import { NextRequest, NextResponse } from "next/server";
import { PlanChangeSummary } from "@/lib/sim/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PlanChangeSummary;
  // In a real implementation we would persist to Firestore or call backend services.
  // For now we simply echo the payload to confirm the request was received.
  return NextResponse.json({ ok: true, applied: body });
}
