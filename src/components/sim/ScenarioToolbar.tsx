"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Rocket, Share2, Sparkles, Upload } from "lucide-react";
import { ReactNode } from "react";

interface ScenarioToolbarProps {
  title?: string;
  description?: string;
  onNew: () => void;
  onPreset: () => void;
  onImport: () => void;
  onShare: () => void;
  onSave: () => void;
  isSaving?: boolean;
  canSave?: boolean;
  canShare?: boolean;
  extraActions?: ReactNode;
}

export function ScenarioToolbar({
  title = "Scenario simulations",
  description = "Explore what-if cases such as income changes, travel or debt payoff.",
  onNew,
  onPreset,
  onImport,
  onShare,
  onSave,
  isSaving,
  canSave,
  canShare = true,
  extraActions,
}: ScenarioToolbarProps) {
  return (
    <header className="flex flex-col gap-6 rounded-3xl border border-slate-900/60 bg-slate-950/60 px-6 py-6 shadow-lg shadow-slate-950/40 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white lg:text-3xl">{title}</h1>
        <p className="max-w-2xl text-sm text-slate-300 lg:text-base">{description}</p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {extraActions}
        <Button
          onClick={onNew}
          className="rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 px-4 text-slate-950 shadow-lg shadow-cyan-900/40 hover:shadow-2xl"
        >
          <Plus className="mr-2 h-4 w-4" /> New scenario
        </Button>
        <Button
          variant="secondary"
          onClick={onPreset}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Preset
        </Button>
        <Button
          variant="secondary"
          onClick={onImport}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
        >
          <Upload className="mr-2 h-4 w-4" /> Import from Forecast
        </Button>
        <Button
          variant="secondary"
          onClick={onSave}
          disabled={!canSave || isSaving}
          className={cn(
            "rounded-2xl border border-emerald-500/60 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20",
            !canSave && "opacity-50",
          )}
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />} Save scenario
        </Button>
        <Button
          variant="secondary"
          onClick={onShare}
          disabled={!canShare}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
        >
          <Share2 className="mr-2 h-4 w-4" /> Share / Export
        </Button>
      </div>
    </header>
  );
}
