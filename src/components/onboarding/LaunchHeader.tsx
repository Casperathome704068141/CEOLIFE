"use client";

import { Button } from "@/components/ui/button";
import { ProgressMeter } from "./ProgressMeter";
import { useOnboardingStore } from "@/lib/onboarding/state";
import { getFocusedStep } from "@/lib/onboarding/state";

interface LaunchHeaderProps {
  onStart: () => void;
  onSkip?: () => void;
}

export function LaunchHeader({ onStart, onSkip }: LaunchHeaderProps) {
  const progress = useOnboardingStore((state) => state.setup.progress);
  const focusedStepIndex = useOnboardingStore((state) => state.focusedStepIndex);
  const openDrawer = useOnboardingStore((state) => state.openDrawer);

  return (
    <header className="space-y-6 rounded-xl border border-border/60 bg-background/50 p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Onboarding</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Kickstart BENO with a guided checklist.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" onClick={onSkip}>
            Skip for now
          </Button>
          <Button
            onClick={() => {
              const current = getFocusedStep(focusedStepIndex);
              openDrawer(current);
              onStart();
            }}
          >
            {progress === 0 ? "Start guided setup" : "Continue guided setup"}
          </Button>
        </div>
      </div>
      <ProgressMeter />
    </header>
  );
}
