import { NextResponse } from "next/server";
import { fundGoal } from "../../store";

interface Params {
  params: { goalId: string };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const payload = await request.json();
    const amount = Number(payload.amount);
    const goal = await fundGoal(params.goalId, amount);
    return NextResponse.json(goal);
  } catch (error) {
    console.error("[goals] fund failed", error);
    return NextResponse.json({ error: "Unable to fund goal" }, { status: 400 });
  }
}
