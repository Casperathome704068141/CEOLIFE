"use client";

import { TimelineEntry } from "@/lib/graph/types";
import { formatDateTime, formatRelative } from "@/lib/ui/format";
import { cn } from "@/lib/utils";

const statusStyles: Record<TimelineEntry["status"], string> = {
  scheduled: "border-cyan-500/60 bg-cyan-500/10 text-cyan-100",
  completed: "border-emerald-500/60 bg-emerald-500/10 text-emerald-100",
  atRisk: "border-amber-500/60 bg-amber-500/10 text-amber-100",
};

type Props = {
  entries: TimelineEntry[];
};

export function TimelineLens({ entries }: Props) {
  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <div
          key={entry.id}
          className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{entry.label}</p>
              <p className="text-xs text-slate-400">{entry.detail}</p>
            </div>
            <span className={cn("rounded-full border px-3 py-1 text-xs", statusStyles[entry.status])}>
              {entry.status === "scheduled" ? "Scheduled" : entry.status === "completed" ? "Done" : "At risk"}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{formatDateTime(entry.date)}</span>
            <span>{formatRelative(entry.date)}</span>
          </div>
        </div>
      ))}
      {entries.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800/80 p-6 text-center text-sm text-slate-400">
          No timeline items available.
        </div>
      )}
    </div>
  );
}

