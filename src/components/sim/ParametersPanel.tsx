"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { ScenarioAssumptions, ScenarioParameters, ShockEvent } from "@/lib/sim/types";
import { Calculator, CloudLightning, SlidersHorizontal } from "lucide-react";

interface ParametersPanelProps {
  params: ScenarioParameters;
  assumptions: ScenarioAssumptions;
  shocks: ShockEvent[];
  onChange: (params: ScenarioParameters) => void;
  onRun: () => void;
  onOpenAssumptions: () => void;
  onOpenShocks: () => void;
  onOpenDebtPlanner: () => void;
  isRunning?: boolean;
}

export function ParametersPanel({
  params,
  assumptions,
  shocks,
  onChange,
  onRun,
  onOpenAssumptions,
  onOpenShocks,
  onOpenDebtPlanner,
  isRunning,
}: ParametersPanelProps) {
  const travelIsMonthly = params.travelRecurring === "monthly";

  const setField = <K extends keyof ScenarioParameters>(key: K, value: ScenarioParameters[K]) => {
    onChange({ ...params, [key]: value });
  };

  const horizonMarks = useMemo(
    () => ({
      min: 6,
      max: 36,
    }),
    [],
  );

  return (
    <Card className="flex h-full flex-col gap-6 rounded-3xl border border-slate-900/60 bg-slate-950/70 p-6 text-slate-100">
      <div>
        <h2 className="text-lg font-semibold text-white">Parameters</h2>
        <p className="text-xs text-slate-400">Adjust to see projected balance curve.</p>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-slate-400">Horizon (months)</Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[params.horizonMonths ?? 12]}
              min={horizonMarks.min}
              max={horizonMarks.max}
              step={1}
              onValueChange={([value]) => setField("horizonMonths", value)}
            />
            <span className="w-12 text-sm text-slate-300">{params.horizonMonths}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <ParameterInput
            label="Income delta (%)"
            value={params.incomeDeltaPct ?? 0}
            onChange={(value) => setField("incomeDeltaPct", value)}
          />
          <ParameterInput
            label="Discretionary delta (%)"
            value={params.discretionaryDeltaPct ?? 0}
            onChange={(value) => setField("discretionaryDeltaPct", value)}
          />
          <ParameterInput
            label="Rent / housing change (%)"
            value={params.rentDeltaPct ?? 0}
            onChange={(value) => setField("rentDeltaPct", value)}
          />
        </div>
        <div className="space-y-2 rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between text-sm">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Travel budget</Label>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              Monthly
              <Switch checked={travelIsMonthly} onCheckedChange={(checked) => setField("travelRecurring", checked ? "monthly" : "one-off")} />
              One-off
            </div>
          </div>
          <Input
            type="number"
            min={0}
            value={params.travelBudget ?? ""}
            onChange={(event) => setField("travelBudget", Number(event.target.value))}
            className="rounded-2xl border-slate-800 bg-slate-950/60 text-slate-100"
            placeholder="0"
          />
        </div>
        <ParameterInput
          label="Debt extra payment (per month)"
          value={params.debtPayExtra ?? 0}
          onChange={(value) => setField("debtPayExtra", value)}
        />
      </div>
      <div className="mt-auto space-y-3">
        <Button
          onClick={onRun}
          disabled={isRunning}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 py-6 text-base font-semibold text-slate-950 shadow-xl shadow-cyan-900/40 hover:shadow-2xl"
        >
          <Calculator className="mr-2 h-5 w-5" /> {isRunning ? "Running..." : "Run Beno simulation"}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={onOpenAssumptions}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Assumptions
          </Button>
          <Button
            variant="secondary"
            onClick={onOpenShocks}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
          >
            <CloudLightning className="mr-2 h-4 w-4" /> Shock events
          </Button>
          <Button
            variant="secondary"
            onClick={onOpenDebtPlanner}
            className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
          >
            Debt payoff planner
          </Button>
        </div>
        <p className="text-[11px] leading-snug text-slate-500">
          Inflation {assumptions.inflationPct ?? 3}% · Returns {assumptions.returnPct ?? 2}% · Shocks {shocks.length}
        </p>
      </div>
    </Card>
  );
}

interface ParameterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function ParameterInput({ label, value, onChange }: ParameterInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-slate-400">{label}</Label>
      <Input
        type="number"
        value={Number.isNaN(value) ? "" : value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-2xl border-slate-800 bg-slate-950/60 text-slate-100"
      />
    </div>
  );
}
