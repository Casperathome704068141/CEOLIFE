
"use client";

import { useSimulations } from "@/lib/sim/useSimulations";
import { ScenarioEditor } from "@/components/sim/ScenarioEditor";
import { ScenarioToolbar } from "@/components/sim/ScenarioToolbar";
import { useState } from "react";
import { MonteCarloResult, Scenario, ScenarioParameters, SimResult } from "@/lib/sim/types";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_PARAMS: ScenarioParameters = {
  horizonMonths: 18,
  incomeDeltaPct: 0,
  discretionaryDeltaPct: 0,
  rentDeltaPct: 0,
};

export default function ForecastsPage() {
  const { scenarios, createScenario, updateScenario, deleteScenario, run, runMonteCarlo } = useSimulations();
  const [currentParams, setCurrentParams] = useState<ScenarioParameters>(DEFAULT_PARAMS);
  const [result, setResult] = useState<SimResult | undefined>();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const { toast } = useToast();

  const handleRun = async () => {
    try {
      const sim = await run({ params: currentParams });
      setResult(sim);
    } catch (error) {
      toast({ variant: "destructive", title: "Simulation failed" });
    }
  };

  const handleSave = async () => {
    if (selectedScenario) {
      await updateScenario({
        id: selectedScenario.id,
        data: { name: selectedScenario.name, params: currentParams, results: result },
      });
    } else {
      const id = await createScenario({ name: "New Scenario", params: currentParams });
      const newScenario = scenarios.find(s => s.id === id);
      if (newScenario) setSelectedScenario(newScenario);
    }
  };

  return (
    <div className="space-y-6">
      <ScenarioToolbar
        onNew={() => {
          setSelectedScenario(null);
          setCurrentParams(DEFAULT_PARAMS);
          setResult(undefined);
        }}
        onPreset={() => {}}
        onImport={() => {}}
        onShare={() => {}}
        onSave={handleSave}
        canSave={!!result}
      />
      <ScenarioEditor
        scenario={selectedScenario}
        params={currentParams}
        assumptions={{}}
        shocks={[]}
        result={result}
        onParamsChange={setCurrentParams}
        onRun={handleRun}
        onOpenAssumptions={() => {}}
        onOpenShocks={() => {}}
        onOpenDebtPlanner={() => {}}
        onOpenCompare={() => {}}
        onOpenApplyPlan={() => {}}
        onRunMonteCarlo={async () => {}}
        onUseMedianPath={() => {}}
        onApplySensitivity={() => {}}
      />
    </div>
  );
}

