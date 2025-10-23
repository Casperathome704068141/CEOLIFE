"use client";

import { useMemo } from "react";
import { Scenario, ScenarioParameters, ScenarioAssumptions, ShockEvent, SimResult } from "@/lib/sim/types";
import { ParametersPanel } from "./ParametersPanel";
import { KpiBar } from "./KpiBar";
import { TimelineChart, TimelineOverlay } from "./TimelineChart";
import { SensitivityCard, SensitivityRow } from "./SensitivityCard";
import { MonteCarloCard } from "./MonteCarloCard";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MonteCarloResult } from "@/lib/sim/types";

interface ScenarioEditorProps {
  scenario: Scenario | null;
  params: ScenarioParameters;
  assumptions: ScenarioAssumptions;
  shocks: ShockEvent[];
  result?: SimResult;
  monteCarlo?: MonteCarloResult;
  sensitivity?: SensitivityRow[];
  overlays?: TimelineOverlay[];
  onParamsChange: (params: ScenarioParameters) => void;
  onRun: () => void;
  onOpenAssumptions: () => void;
  onOpenShocks: () => void;
  onOpenDebtPlanner: () => void;
  onOpenCompare: () => void;
  onOpenApplyPlan: () => void;
  onRunMonteCarlo: (options: { trials: number; volatility: { incomePct: number; expensePct: number } }) => void;
  onUseMedianPath: () => void;
  onApplySensitivity: (key: keyof ScenarioParameters, delta: number) => void;
  isRunning?: boolean;
}

export function ScenarioEditor({
  scenario,
  params,
  assumptions,
  shocks,
  result,
  monteCarlo,
  sensitivity,
  overlays,
  onParamsChange,
  onRun,
  onOpenAssumptions,
  onOpenShocks,
  onOpenDebtPlanner,
  onOpenCompare,
  onOpenApplyPlan,
  onRunMonteCarlo,
  onUseMedianPath,
  onApplySensitivity,
  isRunning,
}: ScenarioEditorProps) {
  const emptyState = useMemo(() => !result, [result]);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
      <ParametersPanel
        params={params}
        assumptions={assumptions}
        shocks={shocks}
        onChange={onParamsChange}
        onRun={onRun}
        onOpenAssumptions={onOpenAssumptions}
        onOpenShocks={onOpenShocks}
        onOpenDebtPlanner={onOpenDebtPlanner}
        isRunning={isRunning}
      />
      <div className="space-y-6">
        <Card className={cn("rounded-3xl border border-slate-900/60 bg-slate-950/70 p-6", emptyState && "opacity-70")}
        >
          <KpiBar result={result} params={params} />
          <div className="mt-6">
            <TimelineChart
              result={result}
              overlays={overlays}
              onOpenApplyPlan={onOpenApplyPlan}
              onOpenCompare={onOpenCompare}
            />
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          <SensitivityCard rows={sensitivity} onApply={onApplySensitivity} />
          <MonteCarloCard
            result={monteCarlo}
            params={params}
            onRun={onRunMonteCarlo}
            onUseMedianPath={onUseMedianPath}
          />
        </div>
      </div>
    </div>
  );
}
