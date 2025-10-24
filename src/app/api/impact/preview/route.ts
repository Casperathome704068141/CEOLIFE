import { NextRequest, NextResponse } from "next/server";
import { planImpact } from "@/lib/core/impactPlanner";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const plan = planImpact({
    intent: body.intent,
    entityId: body.entityId,
    patch: body.patch,
    amount: body.amount,
  });

  return NextResponse.json({ plan });
}

