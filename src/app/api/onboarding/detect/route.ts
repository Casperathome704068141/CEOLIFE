import { NextResponse } from "next/server";
import { mergeSetup, getServerSetup, computeProgress } from "@/lib/onboarding/serverState";
import { StepKey, StepOrder, Setup } from "@/lib/onboarding/validators";
import { DetectResponse } from "@/lib/onboarding/types";

function determineMissing(setup: Setup): StepKey[] {
  return StepOrder.filter((step) => !setup.steps[step]);
}

function buildProgressByStep(setup: Setup): Record<StepKey, number> {
  return StepOrder.reduce((acc, step) => {
    acc[step] = setup.steps[step] ? 100 : 0;
    return acc;
  }, {} as Record<StepKey, number>);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const incoming = body?.setup as Partial<Setup> | undefined;
  const setup = incoming ? mergeSetup(incoming) : getServerSetup();
  const response: DetectResponse = {
    missing: determineMissing(setup),
    progressByStep: buildProgressByStep(setup),
    setup: { ...setup, progress: computeProgress(setup.steps) },
  };
  return NextResponse.json(response);
}
