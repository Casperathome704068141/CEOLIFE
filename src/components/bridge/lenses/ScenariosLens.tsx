"use client";

import { ScenarioPreview } from "@/lib/graph/types";
import { Button } from "@/components/ui/button";
import { formatPercent } from "@/lib/ui/format";

type Props = {
  scenarios: ScenarioPreview[];
  onSelectScenario?: (scenario: ScenarioPreview) => void;
};

export function ScenariosLens({ scenarios, onSelectScenario }: Props) {
  return (
    <div className="space-y-3">
      {scenarios.map(scenario => (
        <div key={scenario.id} className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{scenario.title}</p>
              <p className="text-xs text-slate-400">{scenario.description}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-500/40 text-xs text-emerald-200 hover:bg-emerald-500/10"
              onClick={() => onSelectScenario?.(scenario)}
            >
              Simulate
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
            {scenario.runwayDelta !== undefined && (
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-200">
                Runway {scenario.runwayDelta > 0 ? "+" : ""}
                {scenario.runwayDelta}d
              </span>
            )}
            {scenario.burnDelta !== undefined && (
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-200">
                Burn {scenario.burnDelta > 0 ? "+" : ""}
                {formatPercent(scenario.burnDelta)}
              </span>
            )}
            {scenario.goalEtaDeltaDays !== undefined && (
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-200">
                Goal ETA {scenario.goalEtaDeltaDays}
              </span>
            )}
          </div>
        </div>
      ))}
      {scenarios.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800/80 p-6 text-center text-sm text-slate-400">
          No scenarios available.
        </div>
      )}
    </div>
  );
}

