"use client";

import { useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scenario } from "@/lib/sim/types";
import { format } from "date-fns";

interface CompareDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenarios: Scenario[];
  selected: string[];
  onSelectionChange: (selection: string[]) => void;
  baselineId?: string;
  onSetBaseline: (scenario: Scenario) => void;
}

export function CompareDrawer({
  open,
  onOpenChange,
  scenarios,
  selected,
  onSelectionChange,
  baselineId,
  onSetBaseline,
}: CompareDrawerProps) {
  const toggleSelection = (id: string) => {
    if (selected.includes(id)) {
      onSelectionChange(selected.filter((existing) => existing !== id));
    } else if (selected.length < 3) {
      onSelectionChange([...selected, id]);
    }
  };

  const selectedScenarios = useMemo(
    () => scenarios.filter((scenario) => selected.includes(scenario.id)),
    [selected, scenarios],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full max-w-xl flex-col gap-6 bg-slate-950/95 text-slate-100">
        <SheetHeader>
          <SheetTitle>Compare scenarios</SheetTitle>
          <SheetDescription>Select up to three scenarios to overlay onto the timeline.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {scenarios.map((scenario) => {
              const isSelected = selected.includes(scenario.id);
              const result = scenario.results;
              return (
                <label
                  key={scenario.id}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-900/70 bg-slate-900/40 p-4 transition hover:border-cyan-500/40"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelection(scenario.id)}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-white">{scenario.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {scenario.updatedAt ? format(new Date(scenario.updatedAt), "MMM d") : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400">
                      <div>
                        <p className="text-slate-500">Runway</p>
                        <p className="text-emerald-300">{result?.runwayMonths ?? "–"} mo</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Final balance</p>
                        <p className="text-sky-300">
                          {result?.monthly.at(-1)?.balance?.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          }) ?? "–"}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </ScrollArea>
        <SheetFooter className="flex flex-col gap-4">
          {selectedScenarios.length ? (
            <div className="rounded-2xl border border-slate-900/70 bg-slate-900/40 p-4 text-xs text-slate-400">
              <p className="mb-2 text-sm font-semibold text-white">Selected overlays</p>
              <ul className="space-y-1">
                {selectedScenarios.map((scenario) => (
                  <li key={scenario.id} className="flex items-center justify-between">
                    <span>{scenario.name}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onSetBaseline(scenario)}
                      className="rounded-xl border border-slate-800 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
                    >
                      {baselineId === scenario.id ? "Baseline" : "Set as baseline"}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <Button onClick={() => onOpenChange(false)} className="rounded-2xl bg-slate-800 text-slate-100 hover:bg-slate-700">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
