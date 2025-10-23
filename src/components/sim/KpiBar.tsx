"use client";

import { SimResult, ScenarioParameters } from "@/lib/sim/types";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface KpiBarProps {
  result?: SimResult;
  params: ScenarioParameters;
}

const safeFormatDate = (value?: string) => {
  if (!value) return "—";
  try {
    return format(new Date(value), "MMM yyyy");
  } catch (error) {
    return "—";
  }
};

export function KpiBar({ result, params }: KpiBarProps) {
  const runway = result?.runwayMonths ?? 0;
  const breakEvenDate = safeFormatDate(result?.breakEvenDate);
  const finalBalance = result?.monthly.at(-1)?.balance ?? 0;
  const risk = result?.riskScore ?? 0;
  const riskColor = risk > 70 ? "text-emerald-300" : risk > 40 ? "text-amber-300" : "text-red-300";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiItem label="Runway" value={runway ? `${runway} months` : "—"} accent="from-emerald-500/50 to-cyan-500/20">
        Projection horizon {params.horizonMonths} months
      </KpiItem>
      <KpiItem label="Break-even" value={breakEvenDate} accent="from-sky-500/40 to-indigo-500/10">
        Monthly cashflow turns positive {breakEvenDate}
      </KpiItem>
      <KpiItem
        label="Goal ETAs"
        value={
          result?.goalEtas?.length
            ? result.goalEtas
                .slice(0, 3)
                .map((goal) => `${goal.goalId}: ${safeFormatDate(goal.eta)}`)
                .join(" · ")
            : "No goals"
        }
        accent="from-purple-500/40 to-fuchsia-500/10"
      >
        Tracking the next {result?.goalEtas?.length ?? 0} goals
      </KpiItem>
      <KpiItem label="Risk score" value={`${risk}`} accent="from-red-500/30 to-orange-500/20" valueClassName={riskColor}>
        Volatility-adjusted score out of 100
      </KpiItem>
    </div>
  );
}

interface KpiItemProps {
  label: string;
  value: string;
  accent: string;
  valueClassName?: string;
  children?: React.ReactNode;
}

function KpiItem({ label, value, accent, valueClassName, children }: KpiItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-slate-900/70 bg-slate-900/50 p-4"
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-40`} />
      <div className="relative space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`text-lg font-semibold text-white ${valueClassName ?? ""}`}>{value}</p>
        {children ? <p className="text-xs text-slate-400">{children}</p> : null}
      </div>
    </motion.div>
  );
}
