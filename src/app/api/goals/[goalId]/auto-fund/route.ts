import { NextResponse } from "next/server";
import { upsertAutoFundRule } from "../../store";

interface Params {
  params: { goalId: string };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const payload = await request.json();
    const result = await upsertAutoFundRule(params.goalId, payload);
    return NextResponse.json({ automationId: result.automationId, goal: result.goal });
  } catch (error) {
    console.error("[goals] auto fund failed", error);
    return NextResponse.json({ error: "Failed to configure auto-funding" }, { status: 400 });
  }
}
