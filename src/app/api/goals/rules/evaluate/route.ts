import { NextResponse } from "next/server";

interface EvaluationRequest {
  goalId: string;
  signal: string;
  payload?: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EvaluationRequest;
    return NextResponse.json({
      status: "queued",
      goalId: body.goalId,
      signal: body.signal,
      recommendations: [
        {
          id: "baseline",
          summary: "Real-time rule evaluation runs in Firebase Functions. Local dev returns a static acknowledgement.",
        },
      ],
    });
  } catch (error) {
    console.error("[goals] rule evaluation failed", error);
    return NextResponse.json({ error: "Unable to evaluate rules" }, { status: 400 });
  }
}
