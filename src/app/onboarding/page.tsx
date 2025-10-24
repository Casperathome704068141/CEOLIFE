"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LaunchHeader } from "@/components/onboarding/LaunchHeader";
import { StepCard } from "@/components/onboarding/StepCard";
import { SideAssistant } from "@/components/onboarding/SideAssistant";
import { AccountsDrawer } from "@/components/onboarding/steps/AccountsDrawer";
import { PeopleDrawer } from "@/components/onboarding/steps/PeopleDrawer";
import { DocumentsDrawer } from "@/components/onboarding/steps/DocumentsDrawer";
import { HouseholdDrawer } from "@/components/onboarding/steps/HouseholdDrawer";
import { FinanceDrawer } from "@/components/onboarding/steps/FinanceDrawer";
import { HealthDrawer } from "@/components/onboarding/steps/HealthDrawer";
import { AutomationsDrawer } from "@/components/onboarding/steps/AutomationsDrawer";
import { GoalsDrawer } from "@/components/onboarding/steps/GoalsDrawer";
import { SummaryDialog } from "@/components/onboarding/steps/SummaryDialog";
import { StepDefinitions } from "@/lib/onboarding/types";
import { useOnboardingStore, getFocusedStep } from "@/lib/onboarding/state";
import { detectSetup, requestPreview } from "@/lib/onboarding/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function metricForStep(step: string, setup: ReturnType<typeof useOnboardingStore.getState>["setup"]) {
  switch (step) {
    case "accounts":
      return `${Object.keys(setup.data.integrations ?? {}).length}/5 connected`;
    case "people":
      return `${setup.data.contacts?.length ?? 0} contacts`;
    case "documents":
      return `${setup.data.docs?.length ?? 0} docs`;
    case "household":
      return `${setup.data.household?.assets?.length ?? 0} assets`;
    case "finance":
      return `${(setup.data.finance?.income?.length ?? 0) + (setup.data.finance?.bills?.length ?? 0)} items`;
    case "health":
      return `${setup.data.care?.length ?? 0} profiles`;
    case "automations":
      return `${setup.data.rules?.length ?? 0} rules`;
    case "goals":
      return `${setup.data.goals?.length ?? 0} goals`;
    default:
      return "--";
  }
}

export default function OnboardingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const setup = useOnboardingStore((state) => state.setup);
  const loadFromServer = useOnboardingStore((state) => state.loadFromServer);
  const openDrawer = useOnboardingStore((state) => state.openDrawer);
  const closeDrawer = useOnboardingStore((state) => state.closeDrawer);
  const drawer = useOnboardingStore((state) => state.drawer);
  const focusedStepIndex = useOnboardingStore((state) => state.focusedStepIndex);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const prevStep = useOnboardingStore((state) => state.prevStep);
  const setPreview = useOnboardingStore((state) => state.setPreview);

  const [initializing, setInitializing] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const existing = await detectSetup();
      if (existing) {
        loadFromServer(existing);
        const preview = await requestPreview(existing);
        setPreview({
          readiness: preview.readiness,
          financeForecast: preview.finance?.forecast ?? [],
          upcomingBills: preview.finance?.bills ?? [],
          care: preview.care ?? [],
          rules: preview.rules ?? [],
        });
      }
      setInitializing(false);
    };
    initialize();
  }, [loadFromServer, setPreview]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Tab" && !event.shiftKey) {
        event.preventDefault();
        nextStep();
        return;
      }
      if (event.key === "Tab" && event.shiftKey) {
        event.preventDefault();
        prevStep();
        return;
      }
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        nextStep();
        return;
      }
      if (event.key === "Enter" && !drawer.open) {
        event.preventDefault();
        const step = getFocusedStep(useOnboardingStore.getState().focusedStepIndex);
        openDrawer(step);
        return;
      }
      if (event.key.toLowerCase() === "s" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        window.dispatchEvent(new Event("onboarding-save"));
        return;
      }
      if (
        event.key.toLowerCase() === "f" &&
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey
      ) {
        event.preventDefault();
        setSummaryOpen(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [drawer.open, nextStep, openDrawer, prevStep]);

  const metrics = useMemo(() => {
    const state = useOnboardingStore.getState().setup;
    return StepDefinitions.reduce<Record<string, string>>((acc, step) => {
      acc[step.key] = metricForStep(step.key, state);
      return acc;
    }, {});
  }, [setup]);

  const handleSkip = () => {
    toast({
      title: "Onboarding skipped",
      description: "You can return to the launch console at any time.",
    });
    router.push("/");
  };

  const handleStart = () => {
    const step = getFocusedStep(focusedStepIndex);
    openDrawer(step);
  };

  if (initializing) {
    return (
      <div className="space-y-6 p-8">
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <LaunchHeader onStart={handleStart} onSkip={handleSkip} />
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {StepDefinitions.map((definition) => (
            <StepCard
              key={definition.key}
              definition={definition}
              metrics={metrics[definition.key]}
              onOpen={openDrawer}
            />
          ))}
          <Button
            variant="outline"
            className="md:col-span-2"
            onClick={() => setSummaryOpen(true)}
          >
            Review readiness summary
          </Button>
        </div>
        <SideAssistant />
      </div>

      <AccountsDrawer open={drawer.open && drawer.step === "accounts"} onClose={closeDrawer} />
      <PeopleDrawer open={drawer.open && drawer.step === "people"} onClose={closeDrawer} />
      <DocumentsDrawer open={drawer.open && drawer.step === "documents"} onClose={closeDrawer} />
      <HouseholdDrawer open={drawer.open && drawer.step === "household"} onClose={closeDrawer} />
      <FinanceDrawer open={drawer.open && drawer.step === "finance"} onClose={closeDrawer} />
      <HealthDrawer open={drawer.open && drawer.step === "health"} onClose={closeDrawer} />
      <AutomationsDrawer open={drawer.open && drawer.step === "automations"} onClose={closeDrawer} />
      <GoalsDrawer open={drawer.open && drawer.step === "goals"} onClose={closeDrawer} />
      <SummaryDialog open={summaryOpen} onClose={() => setSummaryOpen(false)} />
    </div>
  );
}
