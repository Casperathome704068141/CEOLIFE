import { NextRequest, NextResponse } from "next/server";
import { runSimulation } from "@/lib/sim/runSimulation";
import { RunSimulationInput } from "@/lib/sim/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RunSimulationInput;
  const result = runSimulation(body);
  return NextResponse.json({ result });
}
