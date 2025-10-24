"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ImpactPlan } from "@/lib/graph/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/ui/format";

type Props = {
  plan: ImpactPlan | null;
  actionLabel?: string;
  onCommit?: () => void;
  onCancel?: () => void;
  committing?: boolean;
};

export function ImpactPanel({ plan, actionLabel = "Commit", onCommit, onCancel, committing }: Props) {
  return (
    <AnimatePresence>
      {plan && (
        <motion.aside
          key="impact-panel"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          className="absolute right-0 top-0 h-full w-72 rounded-3xl border border-cyan-500/40 bg-slate-950/90 p-4 shadow-2xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Impact Preview</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Before you commit</h3>

          <div className="mt-4 space-y-3">
            {plan.kpiDelta && (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3 text-xs text-slate-200">
                <p className="font-medium text-cyan-200">KPIs</p>
                <ul className="mt-2 space-y-1">
                  {plan.kpiDelta.runwayDays !== undefined && (
                    <li>Runway {plan.kpiDelta.runwayDays > 0 ? "+" : ""}{plan.kpiDelta.runwayDays} days</li>
                  )}
                  {plan.kpiDelta.burnDelta !== undefined && (
                    <li>Burn {plan.kpiDelta.burnDelta > 0 ? "+" : ""}{formatPercent(plan.kpiDelta.burnDelta)}</li>
                  )}
                  {plan.kpiDelta.goalEtaDeltaDays !== undefined && (
                    <li>Goal ETA {plan.kpiDelta.goalEtaDeltaDays} days</li>
                  )}
                  {plan.kpiDelta.adherence !== undefined && (
                    <li>Adherence {plan.kpiDelta.adherence > 0 ? "+" : ""}{formatPercent(plan.kpiDelta.adherence)}</li>
                  )}
                </ul>
              </div>
            )}

            {plan.derivedWrites.length > 0 && (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3 text-xs text-slate-200">
                <p className="font-medium text-cyan-200">Side effects</p>
                <ul className="mt-2 space-y-1">
                  {plan.derivedWrites.map(write => (
                    <li key={`${write.collection}-${write.id}`}>
                      <Badge variant="outline" className="mr-2 border-slate-700 text-slate-300">
                        {write.change}
                      </Badge>
                      {write.collection}/{write.id}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {plan.warnings.length > 0 && (
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100">
                <p className="font-medium">Warnings</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {plan.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button
              className="w-full rounded-full bg-cyan-500 text-slate-900 hover:bg-cyan-400"
              onClick={onCommit}
              disabled={committing}
            >
              {committing ? "Committing…" : actionLabel}
            </Button>
            <Button variant="ghost" className="w-full text-xs text-slate-300" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

