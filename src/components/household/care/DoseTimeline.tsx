"use client";

import { format } from "date-fns";
import type { Dose, Medication } from "@/lib/household/types";

interface DoseTimelineProps {
  medication: Medication;
  doses: Dose[];
}

const statusColors: Record<string, string> = {
  due: "bg-slate-700/60",
  taken: "bg-emerald-500",
  missed: "bg-rose-500",
  snoozed: "bg-amber-400",
  skipped: "bg-slate-500",
};

export function DoseTimeline({ medication, doses }: DoseTimelineProps) {
  const today = new Date();
  const scheduleTimes =
    medication.schedule.type === "fixed" && medication.schedule.times
      ? medication.schedule.times
      : ["08:00", "20:00"];

  const items = scheduleTimes.map((time) => {
    const [hour, minute] = time.split(":").map(Number);
    const scheduledAt = new Date(today);
    scheduledAt.setHours(hour ?? 8, minute ?? 0, 0, 0);
    const match = doses
      .filter((dose) => dose.medId === medication.id)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .find((dose) => Math.abs(new Date(dose.scheduledAt).getTime() - scheduledAt.getTime()) < 60 * 60 * 1000);
    return {
      time,
      scheduledAt,
      status: match?.status ?? "due",
    };
  });

  return (
    <div className="flex items-center gap-3">
      {items.map((item) => (
        <div key={item.time} className="flex flex-col items-center gap-1">
          <span className="text-xs text-slate-400">{format(item.scheduledAt, "HH:mm")}</span>
          <span
            className={`h-3 w-3 rounded-full border border-slate-800 ${statusColors[item.status] ?? "bg-slate-700"}`}
            title={item.status}
          />
        </div>
      ))}
    </div>
  );
}
