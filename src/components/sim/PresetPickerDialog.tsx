"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScenarioPreset, ScenarioParameters } from "@/lib/sim/types";

export interface SimulationPreset {
  id: string;
  name: string;
  preset: ScenarioPreset;
  description?: string;
  params: ScenarioParameters;
}

interface PresetPickerDialogProps {
  open: boolean;
  presets: SimulationPreset[];
  onOpenChange: (open: boolean) => void;
  onSelect: (preset: SimulationPreset) => void;
}

export function PresetPickerDialog({ open, presets, onOpenChange, onSelect }: PresetPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl border border-slate-900/80 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle>Scenario presets</DialogTitle>
          <DialogDescription>Choose a curated template to jump start parameters.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 md:grid-cols-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-900/70 bg-slate-900/40 p-4 text-left transition hover:border-cyan-500/50"
              onClick={() => {
                onSelect(preset);
                onOpenChange(false);
              }}
            >
              <span className="text-sm font-semibold text-white">{preset.name}</span>
              <span className="text-[11px] uppercase tracking-wide text-cyan-200">{preset.preset.replace("-", " ")}</span>
              <span className="text-xs text-slate-400">
                {preset.description ?? "Quick configuration of key income and expense levers."}
              </span>
              <div className="text-xs text-slate-400">
                Horizon {preset.params.horizonMonths} months · Income {preset.params.incomeDeltaPct ?? 0}% · Rent {preset.params.rentDeltaPct ?? 0}%
              </div>
            </button>
          ))}
        </div>
        <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl text-slate-300">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
