"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QueueItem as QueueItemType } from "@/lib/graph/types";
import { formatPercent } from "@/lib/ui/format";

const actionLabels: Record<QueueItemType["actions"][number], string> = {
  Accept: "Accept",
  Schedule: "Schedule",
  Nudge: "Nudge",
  Simulate: "Simulate",
  Explain: "Explain",
  Open: "Open",
  Ignore: "Ignore 7d",
};

type Props = {
  item: QueueItemType;
  isSelected: boolean;
  onSelect: () => void;
  onAction: (action: QueueItemType["actions"][number], item: QueueItemType) => void;
};

export function QueueItem({ item, isSelected, onSelect, onAction }: Props) {
  return (
    <motion.button
      layout
      onClick={onSelect}
      className={cn(
        "group w-full rounded-3xl border border-slate-800/80 bg-slate-900/50 p-4 text-left transition",
        isSelected ? "ring-2 ring-cyan-400/80" : "hover:border-slate-700 hover:bg-slate-900/80"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">{item.kind}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
          {item.impact && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.impact.runwayDelta !== undefined && (
                <Badge variant="outline" className="border-cyan-500/50 bg-cyan-500/10 text-cyan-200">
                  {item.impact.runwayDelta > 0 ? "+" : ""}
                  {item.impact.runwayDelta} runway days
                </Badge>
              )}
              {item.impact.burnDelta !== undefined && (
                <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-200">
                  {item.impact.burnDelta > 0 ? "+" : ""}
                  {item.impact.burnDelta.toFixed(1)}% burn
                </Badge>
              )}
              {item.impact.goalEtaDeltaDays !== undefined && (
                <Badge variant="outline" className="border-indigo-500/40 bg-indigo-500/10 text-indigo-200">
                  ETA {item.impact.goalEtaDeltaDays > 0 ? "+" : ""}
                  {item.impact.goalEtaDeltaDays}d
                </Badge>
              )}
              {item.impact.adherenceDelta !== undefined && (
                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
                  {formatPercent(item.impact.adherenceDelta)} adherence
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-100">
            {Math.round(item.priorityScore)}
          </Badge>
          <div className="flex flex-wrap justify-end gap-2">
            {item.actions.map(action => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                onClick={event => {
                  event.stopPropagation();
                  onAction(action, item);
                }}
                className="border-slate-700 bg-slate-950/50 text-xs text-slate-200 hover:bg-slate-800"
              >
                {actionLabels[action]}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

