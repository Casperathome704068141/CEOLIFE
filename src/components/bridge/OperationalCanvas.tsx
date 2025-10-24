"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueueItem, CanvasContext } from "@/lib/graph/types";
import { TimelineLens } from "./lenses/TimelineLens";
import { CashflowLens } from "./lenses/CashflowLens";
import { DocsLens } from "./lenses/DocsLens";
import { PeopleLens } from "./lenses/PeopleLens";
import { RulesLens } from "./lenses/RulesLens";
import { ScenariosLens } from "./lenses/ScenariosLens";
import { ExplainPopover } from "./ExplainPopover";
import { Badge } from "@/components/ui/badge";

const lensOrder = ["timeline", "cashflow", "docs", "people", "rules", "scenarios"] as const;

type Props = {
  item?: QueueItem | null;
  context?: CanvasContext | null;
  onSimulate?: (scenarioId: string) => void;
  onNudgePerson?: (personId: string) => void;
};

export function OperationalCanvas({ item, context, onSimulate, onNudgePerson }: Props) {
  const [lens, setLens] = useState<(typeof lensOrder)[number]>("timeline");

  const lenses = useMemo(() => {
    if (!context) return [];
    return [
      {
        key: "timeline" as const,
        label: "Timeline",
        content: <TimelineLens entries={context.timeline} />,
      },
      {
        key: "cashflow" as const,
        label: "Cashflow",
        content: (
          <CashflowLens
            variance={context.cashflow.variance}
            burnRate={context.cashflow.burnRate}
            transactions={context.cashflow.transactions}
          />
        ),
      },
      {
        key: "docs" as const,
        label: "Docs",
        content: <DocsLens docs={context.docs} />,
      },
      {
        key: "people" as const,
        label: "People",
        content: <PeopleLens people={context.people} onNudge={person => onNudgePerson?.(person.id)} />,
      },
      {
        key: "rules" as const,
        label: "Rules",
        content: <RulesLens rules={context.rules} />,
      },
      {
        key: "scenarios" as const,
        label: "Scenarios",
        content: <ScenariosLens scenarios={context.scenarios} onSelectScenario={scenario => onSimulate?.(scenario.id)} />,
      },
    ];
  }, [context, onNudgePerson, onSimulate]);

  if (!item || !context) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800/70 bg-slate-950/60 text-center text-sm text-slate-400">
        Pick an attention item to activate the command bridge.
      </div>
    );
  }

  return (
    <div className="relative h-full rounded-3xl border border-slate-900/70 bg-slate-950/80 p-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Operational Canvas</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{context.summary.title}</h2>
          <p className="text-sm text-slate-300">{context.summary.subtitle}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {context.summary.impact?.runwayDays !== undefined && (
              <Badge className="rounded-full bg-cyan-500/20 text-cyan-200">
                Runway {context.summary.impact.runwayDays}
              </Badge>
            )}
            {context.summary.impact?.goalEtaDeltaDays !== undefined && (
              <Badge className="rounded-full bg-indigo-500/20 text-indigo-200">
                ETA {context.summary.impact.goalEtaDeltaDays}
              </Badge>
            )}
          </div>
        </div>
        <ExplainPopover lines={context.explain} />
      </div>

      <Tabs value={lens} onValueChange={value => setLens(value as (typeof lensOrder)[number])} className="mt-6">
        <TabsList className="flex flex-wrap gap-2 bg-slate-900/60 p-1">
          {lenses.map(entry => (
            <TabsTrigger key={entry.key} value={entry.key} className="rounded-full">
              {entry.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {lenses.map(entry => (
          <TabsContent key={entry.key} value={entry.key} className="mt-4">
            {entry.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

