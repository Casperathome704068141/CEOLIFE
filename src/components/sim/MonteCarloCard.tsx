"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MonteCarloResult } from "@/lib/sim/types";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { format } from "date-fns";

interface MonteCarloCardProps {
  result?: MonteCarloResult;
  onRun: (options: { trials: number; volatility: { incomePct: number; expensePct: number } }) => void;
  onUseMedianPath: () => void;
}

const trialOptions = [100, 500, 1000];

export function MonteCarloCard({ result, onRun, onUseMedianPath }: MonteCarloCardProps) {
  const [trials, setTrials] = useState(500);
  const [incomeVol, setIncomeVol] = useState(8);
  const [expenseVol, setExpenseVol] = useState(6);

  return (
    <Card className="flex h-full flex-col gap-5 rounded-3xl border border-slate-900/60 bg-slate-950/70 p-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Monte Carlo</h3>
        <p className="text-xs text-slate-500">Fan chart of percentiles and distribution of ending balances.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          Trials:
          {trialOptions.map((option) => (
            <Button
              key={option}
              size="sm"
              variant={option === trials ? "default" : "secondary"}
              onClick={() => setTrials(option)}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 text-xs text-slate-400">
        <div>
          <Label className="text-xs uppercase tracking-wide text-slate-400">Income volatility</Label>
          <Slider value={[incomeVol]} min={0} max={20} step={1} onValueChange={([value]) => setIncomeVol(value)} />
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-slate-400">Expense volatility</Label>
          <Slider value={[expenseVol]} min={0} max={20} step={1} onValueChange={([value]) => setExpenseVol(value)} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => onRun({ trials, volatility: { incomePct: incomeVol, expensePct: expenseVol } })}
          className="rounded-2xl bg-gradient-to-r from-purple-500/80 to-sky-500/60 text-slate-950 shadow-lg shadow-purple-900/40 hover:shadow-2xl"
        >
          Run Monte Carlo
        </Button>
        <Button
          variant="secondary"
          onClick={onUseMedianPath}
          className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
        >
          Use median path
        </Button>
      </div>
      {result ? (
        <div className="space-y-6">
          <div className="h-48 w-full overflow-hidden rounded-2xl border border-slate-900/60 bg-slate-900/40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.percentiles}>
                <defs>
                  <linearGradient id="mcFan" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), "MMM")}
                  stroke="#475569"
                />
                <YAxis stroke="#475569" tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
                <Tooltip
                  contentStyle={{ background: "#020617", borderRadius: 16, borderColor: "#1e293b" }}
                  labelFormatter={(value) => format(new Date(value), "MMM yyyy")}
                />
                <Area type="monotone" dataKey="p90" stroke="transparent" fill="url(#mcFan)" name="90th" />
                <Area type="monotone" dataKey="p75" stroke="transparent" fill="url(#mcFan)" name="75th" />
                <Area type="monotone" dataKey="p50" stroke="#22d3ee" fill="transparent" name="Median" />
                <Area type="monotone" dataKey="p25" stroke="transparent" fill="url(#mcFan)" name="25th" />
                <Area type="monotone" dataKey="p10" stroke="transparent" fill="url(#mcFan)" name="10th" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="h-40 w-full overflow-hidden rounded-2xl border border-slate-900/60 bg-slate-900/40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.histogram}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" opacity={0.3} />
                <XAxis dataKey="bucket" tickFormatter={(value) => `$${Math.round(value / 1000)}k`} stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip
                  contentStyle={{ background: "#020617", borderRadius: 16, borderColor: "#1e293b" }}
                  formatter={(value: number) => [`${value} trials`, "Count"]}
                />
                <Bar dataKey="count" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400">
            Probability of deficit within horizon: <span className="text-sky-300">{(result.deficitProbability * 100).toFixed(1)}%</span>
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Run a Monte Carlo simulation to see percentile projections.</p>
      )}
    </Card>
  );
}
