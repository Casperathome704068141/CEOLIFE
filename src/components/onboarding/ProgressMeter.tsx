"use client";

import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { StepDefinitions } from "@/lib/onboarding/types";
import { useOnboardingStore } from "@/lib/onboarding/state";

export function ProgressMeter() {
  const progress = useOnboardingStore((state) => state.setup.progress);
  const steps = useOnboardingStore((state) => state.setup.steps);

  const completed = useMemo(
    () =>
      StepDefinitions.map((definition) => ({
        key: definition.key,
        done: steps[definition.key],
      })),
    [steps]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Progress</span>
        <span className="font-medium text-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="grid grid-cols-4 gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
        {completed.map((step) => (
          <div
            key={step.key}
            className={`flex items-center gap-2 rounded border px-2 py-1 ${
              step.done
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                : "border-border"
            }`}
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-current" />
            {step.key}
          </div>
        ))}
      </div>
    </div>
  );
}
