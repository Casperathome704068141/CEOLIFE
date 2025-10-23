import { NextResponse } from "next/server";
import { archiveGoal, getGoal, updateGoal } from "../store";

interface Params {
  params: { goalId: string };
}

export async function GET(_request: Request, { params }: Params) {
  const goal = await getGoal(params.goalId);
  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }
  return NextResponse.json(goal);
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const payload = await request.json();
    const goal = await updateGoal(params.goalId, payload);
    return NextResponse.json(goal);
  } catch (error) {
    console.error("[goals] update failed", error);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await archiveGoal(params.goalId);
    return NextResponse.json({ status: "archived" });
  } catch (error) {
    console.error("[goals] archive failed", error);
    return NextResponse.json({ error: "Failed to archive goal" }, { status: 400 });
  }
}
