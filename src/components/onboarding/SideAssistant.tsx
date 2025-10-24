"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOnboardingStore } from "@/lib/onboarding/state";
import { StepDefinitions } from "@/lib/onboarding/types";
import { PreviewPanel } from "./PreviewPanel";

export function SideAssistant() {
  const setup = useOnboardingStore((state) => state.setup);

  const message = useMemo(() => {
    const pending = StepDefinitions.find((step) => !setup.steps[step.key]);
    if (!pending) {
      return "All systems ready! You can finish and launch modules.";
    }
    switch (pending.key) {
      case "accounts":
        return "Linking Plaid and calendars unlocks smarter nudges.";
      case "finance":
        return "Add recurring income and bills to power your finance forecast.";
      case "health":
        return "Capture medications so Beno can monitor refills.";
      default:
        return `Next up: ${pending.title}.`;
    }
  }, [setup.steps]);

  return (
    <div className="space-y-4">
      <Card className="border-border/80 bg-background/70">
        <CardHeader>
          <CardTitle className="text-lg">Beno Assistant</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {message}
        </CardContent>
      </Card>
      <PreviewPanel />
    </div>
  );
}
