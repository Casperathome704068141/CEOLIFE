"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AutomationSuggestion, GoalAnalyticsSnapshot } from "@/lib/goals/types";
import { format } from "date-fns";
import { BrainCircuit, ChevronRight, Layers, RefreshCcw, Sparkles } from "lucide-react";

interface GoalAnalyticsSidebarProps {
  analytics: GoalAnalyticsSnapshot;
  grouping: "none" | "type" | "priority";
  onToggleGrouping: () => void;
  onRunAllSimulations: () => void;
  suggestion: AutomationSuggestion | null;
  onApplySuggestion: (suggestion: AutomationSuggestion) => void;
  onSimulateSuggestion: (suggestion: AutomationSuggestion) => void;
}

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function GoalAnalyticsSidebar({
  analytics,
  grouping,
  onToggleGrouping,
  onRunAllSimulations,
  suggestion,
  onApplySuggestion,
  onSimulateSuggestion,
}: GoalAnalyticsSidebarProps) {
  return (
    <div className="space-y-4">
      <Card className="rounded-3xl border border-slate-900/70 bg-slate-950/70 text-slate-100">
        <CardHeader>
          <CardTitle className="text-base text-white">Mission metrics</CardTitle>
          <p className="text-xs text-slate-400">Beno aggregates every goal across finance, household, and wellness.</p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Active goals</span>
            <span className="font-semibold text-white">{analytics.activeGoals}/{analytics.totalGoals}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Average progress</span>
            <span className="font-semibold text-white">{Math.round(analytics.averageProgress)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Capital allocated</span>
            <span className="font-semibold text-white">{formatCurrency(analytics.totalSaved)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Target surface</span>
            <span className="font-semibold text-white">{formatCurrency(analytics.totalTarget)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Completion rate</span>
            <span className="font-semibold text-white">{Math.round(analytics.completionRate)}%</span>
          </div>
          {analytics.closestDeadline ? (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Closest deadline</span>
              <span className="font-semibold text-white">{format(new Date(analytics.closestDeadline), "MMM d")}</span>
            </div>
          ) : null}
          <div className="pt-3">
            <Button
              variant="secondary"
              className="w-full justify-between rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
              onClick={onRunAllSimulations}
            >
              <span className="inline-flex items-center gap-2"><RefreshCcw className="h-4 w-4" /> Run all simulations</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
              onClick={onToggleGrouping}
            >
              <span className="inline-flex items-center gap-2"><Layers className="h-4 w-4" /> View by {grouping === "type" ? "priority" : grouping === "priority" ? "flat list" : "category"}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      {suggestion ? (
        <Card className="rounded-3xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <BrainCircuit className="h-4 w-4 text-cyan-300" /> Beno insight
            </CardTitle>
            <p className="text-xs text-cyan-100/70">{suggestion.detail}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-3 text-sm text-cyan-100">
              {suggestion.headline}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                className="rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-900/40"
                onClick={() => onApplySuggestion(suggestion)}
              >
                <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> {suggestion.cta.applyLabel}</span>
              </Button>
              <Button
                variant="secondary"
                className="rounded-2xl border border-cyan-500/40 bg-slate-950/40 text-cyan-100 hover:bg-slate-900"
                onClick={() => onSimulateSuggestion(suggestion)}
              >
                {suggestion.cta.simulateLabel}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
