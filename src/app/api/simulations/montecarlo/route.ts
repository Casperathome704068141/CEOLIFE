import { NextRequest, NextResponse } from "next/server";
import { runMonteCarloSimulation } from "@/lib/sim/monteCarlo";
import { MonteCarloRequest } from "@/lib/sim/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as MonteCarloRequest;
  const result = runMonteCarloSimulation(body);
  return NextResponse.json({ result });
}
