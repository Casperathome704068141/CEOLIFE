"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Goal, SimulationInput, SimulationResult } from "@/lib/goals/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Loader2, Save, Share2, Sparkles } from "lucide-react";

interface SimulationDrawerProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSimulate: (goalId: string, input: SimulationInput) => Promise<SimulationResult>;
  onSaveScenario?: (result: SimulationResult, input: SimulationInput) => void;
  onApplyAutomation?: (input: SimulationInput) => void;
  onShare?: (result: SimulationResult) => void;
}

function buildProjection(goal: Goal, input: SimulationInput): SimulationResult {
  const monthlyContribution = input.weeklyContribution * (52 / 12) * (1 + input.incomeChangePct / 100);
  const points: { monthLabel: string; projectedTotal: number; contribution: number }[] = [];
  let current = goal.current;
  let month = 0;
  const maxMonths = 60;

  while (current < goal.target && month < maxMonths) {
    current += monthlyContribution;
    month += 1;
    points.push({
      monthLabel: `M${month}`,
      projectedTotal: Number(current.toFixed(2)),
      contribution: Number(monthlyContribution.toFixed(2)),
    });
  }

  if (points.length === 0) {
    points.push({ monthLabel: "Now", projectedTotal: goal.current, contribution: 0 });
  }

  const reachDate = new Date();
  reachDate.setMonth(reachDate.getMonth() + month);

  return {
    points,
    monthsToTarget: month,
    reachDate: reachDate.toISOString(),
  };
}

const chartConfig = {
  projectedTotal: {
    label: "Projected balance",
    color: "#38bdf8",
  },
};

export function SimulationDrawer({ goal, open, onOpenChange, onSimulate, onSaveScenario, onApplyAutomation, onShare }: SimulationDrawerProps) {
  const [weeklyContribution, setWeeklyContribution] = useState(200);
  const [incomeChangePct, setIncomeChangePct] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    if (goal) {
      const base = goal.autoFundRule?.amount ?? Math.max(50, Math.round((goal.target - goal.current) / 26));
      setWeeklyContribution(base);
      setIncomeChangePct(0);
      setResult(buildProjection(goal, { weeklyContribution: base, incomeChangePct: 0 }));
    }
  }, [goal]);

  const projection = useMemo(() => {
    if (!goal) return null;
    if (result && !isRunning) {
      return result;
    }
    return buildProjection(goal, { weeklyContribution, incomeChangePct });
  }, [goal, result, weeklyContribution, incomeChangePct, isRunning]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-3xl border-l border-slate-900/70 bg-slate-950/95 text-slate-100">
        <SheetHeader>
          <SheetTitle className="text-white">Scenario simulator</SheetTitle>
          <SheetDescription className="text-slate-400">
            Model contributions and income shifts. Apply winning plans with one click.
          </SheetDescription>
        </SheetHeader>
        {goal ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[320px,1fr]">
            <div className="space-y-6 rounded-3xl border border-slate-900/60 bg-slate-950/70 p-5">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-400">Weekly contribution</Label>
                <div className="flex items-baseline justify-between text-sm text-slate-300">
                  <span className="text-2xl font-semibold text-white">${weeklyContribution}</span>
                  <span>per week</span>
                </div>
                <Slider
                  value={[weeklyContribution]}
                  onValueChange={([value]) => setWeeklyContribution(Math.round(value))}
                  min={10}
                  max={1000}
                  step={10}
                  className="mt-4"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-400">Income change</Label>
                <div className="flex items-baseline justify-between text-sm text-slate-300">
                  <span className="text-2xl font-semibold text-white">{incomeChangePct}%</span>
                  <span>expected variation</span>
                </div>
                <Slider
                  value={[incomeChangePct]}
                  onValueChange={([value]) => setIncomeChangePct(Math.round(value))}
                  min={-50}
                  max={100}
                  step={5}
                  className="mt-4"
                />
              </div>
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                <p className="text-xs uppercase tracking-wide text-cyan-200/80">Outcome</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {projection ? (projection.monthsToTarget > 0 ? `Target in ${projection.monthsToTarget} months` : "Target already met") : "Adjust sliders"}
                </p>
                {projection ? (
                  <p className="text-xs text-cyan-100/80">
                    ETA {new Date(projection.reachDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-3">
                <Button
                  className="rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-900/40"
                  disabled={isRunning}
                  onClick={async () => {
                    if (!goal) return;
                    setIsRunning(true);
                    const simInput: SimulationInput = { weeklyContribution, incomeChangePct };
                    try {
                      const response = await onSimulate(goal.id, simInput);
                      setResult(response);
                    } finally {
                      setIsRunning(false);
                    }
                  }}
                >
                  {isRunning ? (
                    <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Computing...</span>
                  ) : (
                    <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Run AI projection</span>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
                  onClick={() => {
                    if (!projection) return;
                    onSaveScenario?.(projection, { weeklyContribution, incomeChangePct });
                  }}
                >
                  <span className="inline-flex items-center gap-2"><Save className="h-4 w-4" /> Save scenario</span>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl border border-cyan-500/50 text-cyan-200 hover:bg-cyan-500/10"
                  onClick={() => onApplyAutomation?.({ weeklyContribution, incomeChangePct })}
                >
                  <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Apply as automation</span>
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
                  onClick={() => {
                    if (!projection) return;
                    onShare?.(projection);
                  }}
                >
                  <span className="inline-flex items-center gap-2"><Share2 className="h-4 w-4" /> Share summary</span>
                </Button>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-900/60 bg-slate-950/70 p-5">
              <ChartContainer
                config={chartConfig}
                className="h-[360px]"
              >
                <ResponsiveContainer>
                  <LineChart data={projection?.points ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                    <XAxis dataKey="monthLabel" stroke="rgba(148,163,184,0.5)" tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(148,163,184,0.5)" tickFormatter={value => `$${Number(value).toLocaleString()}`} width={80} />
                    <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: "rgba(56,189,248,0.4)", strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="projectedTotal" stroke="var(--color-projectedTotal, #38bdf8)" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-800 bg-slate-950/70 p-10 text-center text-slate-400">
            Select a goal to start simulation.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
