"use client";

import { Overview } from "@/lib/graph/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/ui/format";

const metrics = [
  "netWorth",
  "cashOnHand",
  "monthlyBurn",
  "savingsProgress",
  "adherence",
  "pulse",
] as const;

type Props = {
  overview?: Overview;
  onSelectMetric?: (metric: typeof metrics[number]) => void;
};

export function KPITiles({ overview, onSelectMetric }: Props) {
  if (!overview) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="rounded-3xl border border-slate-900/70 bg-slate-950/60">
            <CardContent className="animate-pulse p-6">
              <div className="h-3 w-16 rounded bg-slate-800" />
              <div className="mt-3 h-5 w-24 rounded bg-slate-800" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      <Card
        className="cursor-pointer rounded-3xl border border-slate-900/70 bg-slate-950/70 hover:border-cyan-500/50"
        onClick={() => onSelectMetric?.("netWorth")}
      >
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Net worth</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(overview.netWorth)}</p>
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer rounded-3xl border border-slate-900/70 bg-slate-950/70 hover:border-cyan-500/50"
        onClick={() => onSelectMetric?.("cashOnHand")}
      >
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Cash runway</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(overview.cashOnHand.amount)}</p>
          <p className="text-xs text-slate-400">{overview.cashOnHand.runwayDays} days runway</p>
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer rounded-3xl border border-slate-900/70 bg-slate-950/70 hover:border-cyan-500/50"
        onClick={() => onSelectMetric?.("monthlyBurn")}
      >
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Monthly burn</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(overview.monthlyBurn.actual)}</p>
          <p className="text-xs text-slate-400">Target {formatCurrency(overview.monthlyBurn.target)}</p>
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer rounded-3xl border border-slate-900/70 bg-slate-950/70 hover:border-cyan-500/50"
        onClick={() => onSelectMetric?.("savingsProgress")}
      >
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Savings momentum</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatPercent(overview.savingsProgress.percent)}</p>
          <p className="text-xs text-emerald-300">Δ {formatPercent(overview.savingsProgress.delta)}</p>
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer rounded-3xl border border-slate-900/70 bg-slate-950/70 hover:border-cyan-500/50"
        onClick={() => onSelectMetric?.("adherence")}
      >
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Adherence</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatPercent(overview.adherence.percent30d)}</p>
          <p className="text-xs text-slate-400">On hand {overview.adherence.onHandDays ?? 0} days</p>
        </CardContent>
      </Card>
      <Card
        className="cursor-pointer rounded-3xl border border-slate-900/70 bg-slate-950/70 hover:border-cyan-500/50"
        onClick={() => onSelectMetric?.("pulse")}
      >
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pulse plays</p>
          <p className="mt-2 text-2xl font-semibold text-white">{overview.pulse.games} games</p>
          <p className="text-xs text-cyan-300">Best score {overview.pulse.bestValueScore.toFixed(1)}</p>
        </CardContent>
      </Card>
    </div>
  );
}

