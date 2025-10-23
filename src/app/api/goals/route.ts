import { NextResponse } from "next/server";
import { createGoal, listGoals } from "./store";

export async function GET() {
  const goals = await listGoals();
  return NextResponse.json(goals);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const goal = await createGoal(payload);
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("[goals] create failed", error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 400 });
  }
}
