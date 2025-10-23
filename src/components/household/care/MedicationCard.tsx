"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Dose, Medication } from "@/lib/household/types";
import { DoseTimeline } from "./DoseTimeline";

interface MedicationCardProps {
  medication: Medication;
  doses: Dose[];
  onTaken: () => void;
  onSnooze: () => void;
  onSkip: () => void;
  onRefill: () => void;
  onEdit: () => void;
  onNudge: () => void;
}

function getScheduleSummary(medication: Medication) {
  if (medication.schedule.type === "fixed" && medication.schedule.times) {
    return medication.schedule.times.join(", ") + " daily";
  }
  if (medication.schedule.type === "interval" && medication.schedule.intervalHours) {
    return `Every ${medication.schedule.intervalHours}h`;
  }
  return "Custom schedule";
}

function computeDaysOnHand(medication: Medication) {
  const dosesPerDay =
    medication.schedule.type === "fixed" && medication.schedule.times
      ? medication.schedule.times.length
      : medication.schedule.type === "interval" && medication.schedule.intervalHours
        ? Math.round(24 / medication.schedule.intervalHours)
        : 1;
  return Math.floor(medication.pillsOnHand / (dosesPerDay * (medication.dosage.unitsPerDose || 1)));
}

export function MedicationCard({ medication, doses, onTaken, onSnooze, onSkip, onRefill, onEdit, onNudge }: MedicationCardProps) {
  const daysOnHand = computeDaysOnHand(medication);
  const low = medication.pillsOnHand <= medication.lowStockThreshold;
  const nextRefill = new Date();
  nextRefill.setDate(nextRefill.getDate() + daysOnHand);

  return (
    <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg text-slate-50">{medication.name}</CardTitle>
          <Badge variant="outline" className="rounded-xl border-slate-700 text-xs text-slate-200">
            {getScheduleSummary(medication)}
          </Badge>
        </div>
        <p className="text-xs text-slate-400">{medication.dosage.unitsPerDose} units • {medication.form}</p>
      </CardHeader>
      <CardContent className="space-y-5 text-sm text-slate-200">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase text-slate-500">Today</p>
            <DoseTimeline medication={medication} doses={doses} />
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-slate-500">On-hand days</p>
            <p className="text-lg font-semibold text-slate-100">{daysOnHand}</p>
            <p className="text-xs text-slate-500">Refill by {format(nextRefill, "MMM d")}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Stock remaining</span>
            <span>{medication.pillsOnHand} pills</span>
          </div>
          <Progress value={Math.min(100, (medication.pillsOnHand / Math.max(1, medication.refillPackSize)) * 100)} className="h-2 bg-slate-900" />
          {low ? <p className="text-xs text-amber-400">Low stock — plan refill</p> : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <Button variant="secondary" className="rounded-2xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30" onClick={onTaken}>
            Taken
          </Button>
          <Button variant="secondary" className="rounded-2xl bg-amber-500/20 text-amber-200 hover:bg-amber-500/30" onClick={onSnooze}>
            Snooze 15m
          </Button>
          <Button variant="secondary" className="rounded-2xl bg-slate-700/40 text-slate-200 hover:bg-slate-700/60" onClick={onSkip}>
            Skip
          </Button>
          <Button variant="secondary" className="rounded-2xl bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/40" onClick={onRefill}>
            Refill
          </Button>
          <Button variant="secondary" className="rounded-2xl bg-slate-700/40 text-slate-200 hover:bg-slate-700/60" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="secondary" className="rounded-2xl bg-sky-500/20 text-sky-200 hover:bg-sky-500/40" onClick={onNudge}>
            Nudge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
