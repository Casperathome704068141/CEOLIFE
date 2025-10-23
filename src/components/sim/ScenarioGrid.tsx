"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scenario } from "@/lib/sim/types";
import { format } from "date-fns";
import { ArrowRightLeft, Copy, Trash2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface ScenarioGridProps {
  scenarios: Scenario[];
  activeScenarioId?: string;
  compareSelection: string[];
  onOpen: (scenario: Scenario) => void;
  onDuplicate: (scenario: Scenario) => void;
  onDelete: (scenario: Scenario) => void;
  onToggleCompare: (scenario: Scenario) => void;
}

export function ScenarioGrid({
  scenarios,
  activeScenarioId,
  compareSelection,
  onOpen,
  onDuplicate,
  onDelete,
  onToggleCompare,
}: ScenarioGridProps) {
  if (!scenarios.length) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 text-center">
        <p className="text-sm text-slate-300">No saved scenarios yet. Run a simulation and save it to build your Beno playbook.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      {scenarios.map((scenario) => {
        const isActive = scenario.id === activeScenarioId;
        const isCompared = compareSelection.includes(scenario.id);
        const finalBalance = scenario.results?.monthly.at(-1)?.balance;
        const runway = scenario.results?.runwayMonths;
        return (
          <Card
            key={scenario.id}
            className="group relative overflow-hidden rounded-3xl border border-slate-900/50 bg-slate-950/70 backdrop-blur"
          >
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold text-white">
                  {scenario.name}
                  {scenario.preset ? (
                    <span className="ml-2 rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-cyan-200">
                      {scenario.preset.replace("-", " ")}
                    </span>
                  ) : null}
                </CardTitle>
                <span className="text-xs text-slate-400">
                  {scenario.updatedAt ? format(new Date(scenario.updatedAt), "MMM d, yyyy") : ""}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <p className="text-slate-400">Runway</p>
                  <p className="text-base font-semibold text-emerald-300">{runway ? `${runway} mo` : "–"}</p>
                </div>
                <div>
                  <p className="text-slate-400">Final balance</p>
                  <p className="text-base font-semibold text-sky-300">
                    {typeof finalBalance === "number" ? finalBalance.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 }) : "–"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-20 overflow-hidden rounded-2xl border border-slate-900/60 bg-slate-900/40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scenario.results?.monthly ?? []}>
                    <defs>
                      <linearGradient id={`spark-${scenario.id}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#22d3ee"
                      fill={`url(#spark-${scenario.id})`}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => onOpen(scenario)}
                  className="rounded-2xl bg-slate-800/80 text-slate-100 hover:bg-slate-700"
                >
                  Open
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onDuplicate(scenario)}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                >
                  <Copy className="mr-1 h-3.5 w-3.5" /> Duplicate
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(scenario)}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                </Button>
                <Button
                  size="sm"
                  variant={isCompared ? "default" : "secondary"}
                  onClick={() => onToggleCompare(scenario)}
                  className="ml-auto rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                >
                  <ArrowRightLeft className="mr-1 h-3.5 w-3.5" /> {isCompared ? "Compared" : "Compare"}
                </Button>
              </div>
              {isActive ? (
                <p className="text-xs text-cyan-200">Currently editing</p>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
