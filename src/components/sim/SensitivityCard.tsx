"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScenarioParameters } from "@/lib/sim/types";
import { motion } from "framer-motion";

export interface SensitivityRow {
  key: keyof ScenarioParameters;
  label: string;
  decrease: {
    delta: number;
    runway: number;
    finalBalance: number;
  };
  increase: {
    delta: number;
    runway: number;
    finalBalance: number;
  };
  baselineValue?: number;
}

interface SensitivityCardProps {
  rows?: SensitivityRow[];
  onApply: (key: keyof ScenarioParameters, delta: number) => void;
}

export function SensitivityCard({ rows = [], onApply }: SensitivityCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4 rounded-3xl border border-slate-900/60 bg-slate-950/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Sensitivity</h3>
          <p className="text-xs text-slate-500">Impact on runway and final balance for ± adjustments.</p>
        </div>
      </div>
      <div className="space-y-4">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-400">Run a simulation to unlock tornado analysis.</p>
        ) : (
          rows.map((row) => (
            <div key={row.key as string} className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{row.label}</span>
                <span>{row.baselineValue ?? 0}% base</span>
              </div>
              <div className="flex items-center gap-2">
                <SensitivityBar value={-row.decrease.finalBalance} direction="negative" />
                <div className="flex w-24 flex-col text-[11px] text-slate-400">
                  <span>-{Math.abs(row.decrease.delta)}%</span>
                  <span>{row.decrease.runway} mo</span>
                </div>
                <div className="flex w-24 flex-col text-[11px] text-slate-400">
                  <span>+{Math.abs(row.increase.delta)}%</span>
                  <span>{row.increase.runway} mo</span>
                </div>
                <SensitivityBar value={row.increase.finalBalance} direction="positive" />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onApply(row.key, row.decrease.delta)}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                >
                  Apply -{Math.abs(row.decrease.delta)}%
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onApply(row.key, row.increase.delta)}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                >
                  Apply +{Math.abs(row.increase.delta)}%
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

interface SensitivityBarProps {
  value: number;
  direction: "positive" | "negative";
}

function SensitivityBar({ value, direction }: SensitivityBarProps) {
  const width = Math.min(Math.abs(value) / 5000, 1);
  const background = direction === "positive" ? "bg-emerald-500/40" : "bg-rose-500/40";
  const alignment = direction === "positive" ? "justify-start" : "justify-end";
  return (
    <div className={`flex h-10 w-full max-w-[140px] items-center rounded-2xl border border-slate-800 bg-slate-900/40 ${alignment}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${width * 100}%` }}
        className={`h-6 rounded-2xl ${background}`}
      />
    </div>
  );
}
