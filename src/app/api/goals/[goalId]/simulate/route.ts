import { NextResponse } from "next/server";
import { simulateGoal } from "../../store";

interface Params {
  params: { goalId: string };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const payload = await request.json();
    const result = await simulateGoal(params.goalId, payload);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[goals] simulate failed", error);
    return NextResponse.json({ error: "Simulation failed" }, { status: 400 });
  }
}
