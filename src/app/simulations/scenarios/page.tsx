"use client";

import { useEffect, useMemo, useState } from "react";
import { ScenarioToolbar } from "@/components/sim/ScenarioToolbar";
import { ScenarioGrid } from "@/components/sim/ScenarioGrid";
import { ScenarioEditor } from "@/components/sim/ScenarioEditor";
import { CompareDrawer } from "@/components/sim/CompareDrawer";
import { ApplyPlanDrawer } from "@/components/sim/ApplyPlanDrawer";
import { ExportShareDialog } from "@/components/sim/ExportShareDialog";
import { PresetPickerDialog, SimulationPreset } from "@/components/sim/PresetPickerDialog";
import { DebtPayoffPlanner } from "@/components/sim/DebtPayoffPlanner";
import { ShockEventsEditor } from "@/components/sim/ShockEventsEditor";
import { AssumptionsDrawer } from "@/components/sim/AssumptionsDrawer";
import { useSimulations } from "@/lib/sim/useSimulations";
import {
  MonteCarloResult,
  PlanChangeSummary,
  Scenario,
  ScenarioAssumptions,
  ScenarioParameters,
  ShockEvent,
  SimResult,
} from "@/lib/sim/types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { SensitivityRow } from "@/components/sim/SensitivityCard";
import { TimelineOverlay } from "@/components/sim/TimelineChart";

const DEFAULT_PARAMS: ScenarioParameters = {
  horizonMonths: 18,
  incomeDeltaPct: 0,
  discretionaryDeltaPct: 0,
  rentDeltaPct: 0,
  travelBudget: 0,
  travelRecurring: "one-off",
  debtPayExtra: 0,
};

const DEFAULT_ASSUMPTIONS: ScenarioAssumptions = {
  inflationPct: 3,
  returnPct: 4,
  interestRatesPct: 6,
  savingsRatePct: 12,
};

const BASELINES = {
  income: 6800,
  discretionary: 1400,
  rent: 1900,
};

const sensitivityConfig: Array<{ key: keyof ScenarioParameters; label: string; delta: number }> = [
  { key: "incomeDeltaPct", label: "Income delta", delta: 5 },
  { key: "discretionaryDeltaPct", label: "Discretionary delta", delta: 5 },
  { key: "rentDeltaPct", label: "Rent / housing", delta: 5 },
  { key: "debtPayExtra", label: "Debt extra payment", delta: 100 },
];

function buildPlanSummary(params: ScenarioParameters, _result?: SimResult): PlanChangeSummary {
  const incomeDelta = ((params.incomeDeltaPct ?? 0) / 100) * BASELINES.income;
  const discretionaryDelta = ((params.discretionaryDeltaPct ?? 0) / 100) * BASELINES.discretionary;
  const rentDelta = ((params.rentDeltaPct ?? 0) / 100) * BASELINES.rent;
  const travelDelta = params.travelBudget ?? 0;
  const debtExtra = params.debtPayExtra ?? 0;
  const months = params.horizonMonths ?? 12;

  return {
    budgets: [
      { category: "Income adjustments", delta: incomeDelta },
      { category: "Discretionary envelope", delta: -discretionaryDelta },
      { category: "Housing", delta: rentDelta },
      travelDelta
        ? {
            category: params.travelRecurring === "monthly" ? "Travel (monthly)" : "Travel (one-off)",
            delta: params.travelRecurring === "monthly" ? travelDelta : travelDelta,
          }
        : null,
      debtExtra ? { category: "Debt overpayment", delta: -debtExtra } : null,
    ].filter(Boolean) as Array<{ category: string; delta: number }>,
    automationRules: [
      incomeDelta
        ? {
            id: "income-monitor",
            description: `Monitor paycheck variance (+${Math.round(incomeDelta)})`,
            enabled: true,
          }
        : null,
      discretionaryDelta
        ? {
            id: "discretionary-cap",
            description: "Notify if discretionary burn exceeds target",
            enabled: true,
          }
        : null,
      travelDelta
        ? {
            id: "travel-fund",
            description: "Auto-fund travel wallet",
            enabled: true,
          }
        : null,
    ].filter(Boolean) as PlanChangeSummary["automationRules"],
    debtSchedule: debtExtra
      ? Array.from({ length: Math.min(months, 12) }).map((_, index) => ({
          month: `Month ${index + 1}`,
          amount: debtExtra,
        }))
      : [],
  };
}

export default function ScenariosPage() {
  const { toast } = useToast();
  const {
    scenarios,
    isLoading,
    createScenario,
    updateScenario,
    deleteScenario,
    run,
    runMonteCarlo,
    applyPlan,
  } = useSimulations();

  const [currentParams, setCurrentParams] = useState<ScenarioParameters>(DEFAULT_PARAMS);
  const [assumptions, setAssumptions] = useState<ScenarioAssumptions>(DEFAULT_ASSUMPTIONS);
  const [shocks, setShocks] = useState<ShockEvent[]>([]);
  const [result, setResult] = useState<SimResult | undefined>();
  const [monteCarlo, setMonteCarlo] = useState<MonteCarloResult | undefined>();
  const [sensitivity, setSensitivity] = useState<SensitivityRow[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [scenarioName, setScenarioName] = useState("Untitled scenario");
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [baselineId, setBaselineId] = useState<string | undefined>();
  const [applyOpen, setApplyOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [debtPlannerOpen, setDebtPlannerOpen] = useState(false);
  const [shockEditorOpen, setShockEditorOpen] = useState(false);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const presetsQuery = useQuery<{ presets: SimulationPreset[] }>({
    queryKey: ["simulations", "presets"],
    queryFn: async () => {
      const response = await fetch("/api/simulations/presets");
      if (!response.ok) throw new Error("Failed to load presets");
      return response.json();
    },
  });

  const planSummary = useMemo(() => buildPlanSummary(currentParams, result), [currentParams, result]);

  const overlays = useMemo<TimelineOverlay[]>(() => {
    return compareSelection
      .map((id, index) => {
        const scenario = scenarios.find((item) => item.id === id);
        if (!scenario?.results) return null;
        const palette = ["#60a5fa", "#f472b6", "#facc15"];
        return {
          id: scenario.id,
          name: scenario.name,
          color: palette[index % palette.length],
          result: scenario.results,
        } satisfies TimelineOverlay;
      })
      .filter(Boolean) as TimelineOverlay[];
  }, [compareSelection, scenarios]);

  const isDirty = useMemo(() => {
    if (!selectedScenario) return true;
    const paramsEqual = JSON.stringify(selectedScenario.params) === JSON.stringify(currentParams);
    const assumptionsEqual = JSON.stringify(selectedScenario.assumptions ?? {}) === JSON.stringify(assumptions ?? {});
    const shocksEqual = JSON.stringify(selectedScenario.shocks ?? []) === JSON.stringify(shocks ?? []);
    const nameEqual = selectedScenario.name === scenarioName;
    return !(paramsEqual && assumptionsEqual && shocksEqual && nameEqual);
  }, [selectedScenario, currentParams, assumptions, shocks, scenarioName]);

  const loadScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setScenarioName(scenario.name);
    setCurrentParams({ ...DEFAULT_PARAMS, ...scenario.params });
    setAssumptions({ ...DEFAULT_ASSUMPTIONS, ...scenario.assumptions });
    setShocks(scenario.shocks ?? []);
    setResult(scenario.results);
    setCompareSelection((prev) => prev.filter((id) => id !== scenario.id));
  };

  const resetScenario = () => {
    setSelectedScenario(null);
    setScenarioName("Untitled scenario");
    setCurrentParams(DEFAULT_PARAMS);
    setAssumptions(DEFAULT_ASSUMPTIONS);
    setShocks([]);
    setResult(undefined);
    setMonteCarlo(undefined);
    setSensitivity([]);
  };

  const computeSensitivity = async (baseResult: SimResult) => {
    const rows: SensitivityRow[] = [];
    for (const item of sensitivityConfig) {
      const decreaseParams = {
        ...currentParams,
        [item.key]: ((currentParams[item.key] as number | undefined) ?? 0) - item.delta,
      } as ScenarioParameters;
      const increaseParams = {
        ...currentParams,
        [item.key]: ((currentParams[item.key] as number | undefined) ?? 0) + item.delta,
      } as ScenarioParameters;
      try {
        const [decrease, increase] = await Promise.all([
          run({ params: decreaseParams, shocks, assumptions }),
          run({ params: increaseParams, shocks, assumptions }),
        ]);
        rows.push({
          key: item.key,
          label: item.label,
          baselineValue: (currentParams[item.key] as number | undefined) ?? 0,
          decrease: {
            delta: -Math.abs(item.delta),
            runway: decrease.runwayMonths,
            finalBalance: decrease.monthly.at(-1)?.balance ?? 0,
          },
          increase: {
            delta: Math.abs(item.delta),
            runway: increase.runwayMonths,
            finalBalance: increase.monthly.at(-1)?.balance ?? 0,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
    setSensitivity(rows);
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const sim = await run({ params: currentParams, shocks, assumptions });
      setResult(sim);
      setMonteCarlo(undefined);
      await computeSensitivity(sim);
      toast({ title: "Simulation complete", description: "KPIs and charts refreshed." });
    } catch (error) {
      console.error(error);
      toast({ title: "Simulation failed", description: "Unable to run Beno simulation.", variant: "destructive" });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (selectedScenario) {
        await updateScenario({
          id: selectedScenario.id,
          data: {
            name: scenarioName,
            params: currentParams,
            assumptions,
            shocks,
            results: result,
          },
        });
        setSelectedScenario((prev) =>
          prev
            ? {
                ...prev,
                name: scenarioName,
                params: currentParams,
                assumptions,
                shocks,
                results: result,
                updatedAt: Date.now(),
              }
            : prev,
        );
        toast({ title: "Scenario updated", description: "Saved to your simulations library." });
      } else {
        const id = await createScenario({ name: scenarioName, params: currentParams });
        toast({ title: "Scenario saved", description: "New scenario added to your library." });
        setSelectedScenario({
          id,
          name: scenarioName,
          params: currentParams,
          assumptions,
          shocks,
          results: result,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Save failed", description: "Could not persist scenario.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyPlan = async (summary: PlanChangeSummary) => {
    setIsApplying(true);
    try {
      await applyPlan(summary);
      toast({ title: "Plan applied", description: "Budgets and automations queued." });
    } catch (error) {
      console.error(error);
      toast({ title: "Apply failed", description: "Could not write plan updates.", variant: "destructive" });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRunMonteCarlo = async (options: { trials: number; volatility: { incomePct: number; expensePct: number } }) => {
    try {
      const result = await runMonteCarlo({
        params: currentParams,
        shocks,
        assumptions,
        trials: options.trials,
        volatility: options.volatility,
      });
      setMonteCarlo(result);
      toast({ title: "Monte Carlo ready", description: `${options.trials} trials simulated.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Monte Carlo failed", description: "Unable to compute distribution.", variant: "destructive" });
    }
  };

  const handleUseMedian = () => {
    if (!monteCarlo || !result) return;
    const medianFinal = monteCarlo.percentiles.at(-1)?.p50 ?? 0;
    const baseFinal = result.monthly.at(-1)?.balance ?? medianFinal;
    const delta = (medianFinal - baseFinal) / 1000;
    setCurrentParams((prev) => ({
      ...prev,
      discretionaryDeltaPct: Math.round(((prev.discretionaryDeltaPct ?? 0) - delta) * 10) / 10,
    }));
    toast({ title: "Median path applied", description: "Parameters nudged toward Monte Carlo median." });
    handleRun();
  };

  const handlePreset = (preset: SimulationPreset) => {
    setPresetOpen(false);
    setCurrentParams((prev) => ({ ...prev, ...preset.params }));
    if (preset.name) {
      setScenarioName(preset.name);
    }
    toast({ title: `${preset.name} preset`, description: "Parameters seeded from template." });
  };

  const handleImportForecast = () => {
    setCurrentParams((prev) => ({
      ...prev,
      incomeDeltaPct: 4,
      discretionaryDeltaPct: -6,
      rentDeltaPct: 3,
    }));
    toast({ title: "Forecast imported", description: "Baseline updated from latest finance forecast." });
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.tagName?.toLowerCase() === "input" || (event.target as HTMLElement)?.isContentEditable) {
        return;
      }
      switch (event.key.toLowerCase()) {
        case "r":
          event.preventDefault();
          handleRun();
          break;
        case "a":
          event.preventDefault();
          setAssumptionsOpen(true);
          break;
        case "s":
          event.preventDefault();
          handleSave();
          break;
        case "c":
          event.preventDefault();
          setCompareOpen(true);
          break;
        case "p":
          event.preventDefault();
          setApplyOpen(true);
          break;
        case "m":
          event.preventDefault();
          handleRunMonteCarlo({ trials: 500, volatility: { incomePct: 8, expensePct: 6 } });
          break;
        case "d":
          event.preventDefault();
          setDebtPlannerOpen(true);
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="space-y-6">
      <ScenarioToolbar
        onNew={resetScenario}
        onPreset={() => setPresetOpen(true)}
        onImport={handleImportForecast}
        onShare={() => setShareOpen(true)}
        onSave={handleSave}
        isSaving={isSaving}
        canSave={!!scenarioName && !!result && (isDirty || !selectedScenario)}
        extraActions={
          <Input
            value={scenarioName}
            onChange={(event) => setScenarioName(event.target.value)}
            className="w-48 rounded-2xl border-slate-800 bg-slate-900/70 text-slate-100"
            placeholder="Scenario name"
          />
        }
      />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[380px,minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-900/60 bg-slate-950/70 p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Saved scenarios</h2>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-24 rounded-2xl bg-slate-900/60" />
                <Skeleton className="h-24 rounded-2xl bg-slate-900/60" />
              </div>
            ) : (
              <ScenarioGrid
                scenarios={scenarios}
                activeScenarioId={selectedScenario?.id}
                compareSelection={compareSelection}
                onOpen={(scenario) => loadScenario(scenario)}
                onDuplicate={async (scenario) => {
                  const id = await createScenario({
                    name: `${scenario.name} copy`,
                    params: scenario.params,
                  });
                  toast({ title: "Scenario duplicated", description: "Copy added to grid." });
                }}
                onDelete={async (scenario) => {
                  await deleteScenario(scenario.id);
                  if (selectedScenario?.id === scenario.id) {
                    resetScenario();
                  }
                  toast({ title: "Scenario removed", description: `${scenario.name} deleted.` });
                }}
                onToggleCompare={(scenario) => {
                  setCompareSelection((prev) =>
                    prev.includes(scenario.id)
                      ? prev.filter((id) => id !== scenario.id)
                      : prev.length < 3
                        ? [...prev, scenario.id]
                        : prev,
                  );
                }}
              />
            )}
          </div>
        </div>
        <div className="space-y-6">
          <ScenarioEditor
            scenario={selectedScenario}
            params={currentParams}
            assumptions={assumptions}
            shocks={shocks}
            result={result}
            monteCarlo={monteCarlo}
            sensitivity={sensitivity}
            overlays={overlays}
            onParamsChange={setCurrentParams}
            onRun={handleRun}
            onOpenAssumptions={() => setAssumptionsOpen(true)}
            onOpenShocks={() => setShockEditorOpen(true)}
            onOpenDebtPlanner={() => setDebtPlannerOpen(true)}
            onOpenCompare={() => setCompareOpen(true)}
            onOpenApplyPlan={() => setApplyOpen(true)}
            onRunMonteCarlo={handleRunMonteCarlo}
            onUseMedianPath={handleUseMedian}
            onApplySensitivity={(key, delta) => {
              setCurrentParams((prev) => ({
                ...prev,
                [key]: Math.round((((prev[key] as number | undefined) ?? 0) + delta) * 10) / 10,
              }));
              setTimeout(() => handleRun(), 300);
            }}
            isRunning={isRunning}
          />
        </div>
      </div>

      <CompareDrawer
        open={compareOpen}
        onOpenChange={setCompareOpen}
        scenarios={scenarios}
        selected={compareSelection}
        onSelectionChange={setCompareSelection}
        baselineId={baselineId}
        onSetBaseline={(scenario) => setBaselineId(scenario.id)}
      />
      <ApplyPlanDrawer
        open={applyOpen}
        onOpenChange={setApplyOpen}
        result={result}
        params={currentParams}
        summary={planSummary}
        onApply={handleApplyPlan}
        isApplying={isApplying}
      />
      <ExportShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        scenario={selectedScenario}
        result={result}
        onExport={(format) => toast({ title: `Export ${format.toUpperCase()}`, description: "Snapshot queued for download." })}
        onShare={() => toast({ title: "Shared", description: "WhatsApp summary sent." })}
      />
      <PresetPickerDialog
        open={presetOpen}
        onOpenChange={setPresetOpen}
        presets={presetsQuery.data?.presets ?? []}
        onSelect={handlePreset}
      />
      <DebtPayoffPlanner
        open={debtPlannerOpen}
        onOpenChange={setDebtPlannerOpen}
        onApplyToParameters={(amount) => setCurrentParams((prev) => ({ ...prev, debtPayExtra: amount }))}
        onCreatePlan={(schedule) => {
          toast({ title: "Debt plan drafted", description: "Schedule ready inside Apply as plan." });
          setApplyOpen(true);
        }}
      />
      <ShockEventsEditor
        open={shockEditorOpen}
        onOpenChange={setShockEditorOpen}
        events={shocks}
        onSave={(events) => {
          setShocks(events);
          toast({ title: "Shock events updated", description: `${events.length} events configured.` });
        }}
      />
      <AssumptionsDrawer
        open={assumptionsOpen}
        onOpenChange={setAssumptionsOpen}
        assumptions={assumptions}
        onSave={(next, rerun) => {
          setAssumptions(next);
          if (rerun) {
            handleRun();
          }
        }}
      />
    </div>
  );
}
