"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepDefinition } from "@/lib/onboarding/types";
import { StepKey } from "@/lib/onboarding/validators";
import { useOnboardingStore } from "@/lib/onboarding/state";

interface StepCardProps {
  definition: StepDefinition;
  metrics?: string;
  onOpen: (step: StepKey) => void;
}

export function StepCard({ definition, metrics, onOpen }: StepCardProps) {
  const steps = useOnboardingStore((state) => state.setup.steps);
  const progress = useOnboardingStore((state) => state.setup.progress);
  const status = useMemo(() => {
    if (steps[definition.key]) return "Complete";
    return progress > 0 ? "In progress" : "Not started";
  }, [steps, definition.key, progress]);

  return (
    <Card className="group flex flex-col justify-between border-border bg-background/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>{definition.title}</span>
          <span className="text-xs font-normal text-muted-foreground">{status}</span>
        </CardTitle>
        <CardDescription>{definition.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          {definition.metricsLabel}: <span className="font-medium text-foreground">{metrics ?? "--"}</span>
        </div>
        <Button size="sm" onClick={() => onOpen(definition.key)}>
          Configure
        </Button>
      </CardContent>
    </Card>
  );
}
