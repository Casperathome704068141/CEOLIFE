"use client";

import { Overview } from "@/lib/graph/types";
import { formatCurrency, formatPercent } from "@/lib/ui/format";
import { cn } from "@/lib/utils";

type Props = {
  overview?: Overview;
  mode: "monitor" | "focus";
  onMetricSelect?: (metric: string) => void;
};

const metrics = (
  overview: Overview
): Array<{ key: string; label: string; value: string; sub?: string; accent: string }> => [
  {
    key: "netWorth",
    label: "Net worth",
    value: formatCurrency(overview.netWorth),
    accent: "text-cyan-200",
  },
  {
    key: "runway",
    label: "Runway",
    value: `${overview.cashOnHand.runwayDays} days`,
    sub: formatCurrency(overview.cashOnHand.amount),
    accent: "text-emerald-200",
  },
  {
    key: "burn",
    label: "Burn vs target",
    value: formatCurrency(overview.monthlyBurn.actual),
    sub: `Target ${formatCurrency(overview.monthlyBurn.target)}`,
    accent: "text-amber-200",
  },
  {
    key: "adherence",
    label: "Adherence",
    value: formatPercent(overview.adherence.percent30d),
    sub: `${overview.adherence.onHandDays ?? 0} days on hand`,
    accent: "text-emerald-200",
  },
  {
    key: "goals",
    label: "Top goal",
    value: `${overview.goals.top[0]?.percent ?? 0}% complete`,
    sub: overview.goals.top[0]?.name ?? "—",
    accent: "text-indigo-200",
  },
  {
    key: "pulse",
    label: "Pulse value",
    value: overview.pulse.bestValueScore.toFixed(1),
    sub: `${overview.pulse.games} plays`,
    accent: "text-pink-200",
  },
];

export function TelemetryRail({ overview, mode, onMetricSelect }: Props) {
  if (!overview) {
    return (
      <aside className="hidden h-full rounded-3xl border border-slate-900/70 bg-slate-950/70 p-4 text-xs text-slate-400 xl:flex xl:flex-col xl:gap-3">
        Loading…
      </aside>
    );
  }

  return (
    <aside className="hidden h-full rounded-3xl border border-slate-900/70 bg-slate-950/70 p-4 text-xs xl:flex xl:flex-col xl:gap-3">
      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Telemetry</p>
      <div className="flex flex-1 flex-col gap-3">
        {metrics(overview).map(metric => (
          <button
            key={metric.key}
            onClick={() => onMetricSelect?.(metric.key)}
            className={cn(
              "rounded-2xl border border-slate-900/80 bg-slate-900/50 p-3 text-left transition hover:border-cyan-500/40",
              mode === "monitor" ? "opacity-100" : "opacity-80"
            )}
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
            <p className={cn("mt-1 text-lg font-semibold", metric.accent)}>{metric.value}</p>
            {metric.sub && <p className="text-[11px] text-slate-400">{metric.sub}</p>}
          </button>
        ))}
      </div>
    </aside>
  );
}

