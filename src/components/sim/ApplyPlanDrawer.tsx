"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PlanChangeSummary, ScenarioParameters, SimResult } from "@/lib/sim/types";

interface ApplyPlanDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result?: SimResult;
  params: ScenarioParameters;
  summary: PlanChangeSummary;
  onApply: (summary: PlanChangeSummary) => Promise<void> | void;
  isApplying?: boolean;
}

export function ApplyPlanDrawer({
  open,
  onOpenChange,
  result,
  params,
  summary,
  onApply,
  isApplying,
}: ApplyPlanDrawerProps) {
  const [enabledBudgets, setEnabledBudgets] = useState(true);
  const [enabledAutomation, setEnabledAutomation] = useState(true);
  const [enabledDebt, setEnabledDebt] = useState(true);

  useEffect(() => {
    if (open) {
      setEnabledBudgets(true);
      setEnabledAutomation(true);
      setEnabledDebt(Boolean(summary.debtSchedule.length));
    }
  }, [open, summary.debtSchedule.length]);

  const apply = async () => {
    const filtered: PlanChangeSummary = {
      budgets: enabledBudgets ? summary.budgets : [],
      automationRules: enabledAutomation ? summary.automationRules : [],
      debtSchedule: enabledDebt ? summary.debtSchedule : [],
    };
    await onApply(filtered);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full max-w-xl flex-col gap-6 bg-slate-950/95 text-slate-100">
        <SheetHeader>
          <SheetTitle>Apply as plan</SheetTitle>
          <SheetDescription>Review proposed budget and automation changes before committing.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
          <PlanSection
            title="Budgets"
            description="Adjust upcoming month allocations based on this scenario."
            enabled={enabledBudgets}
            onToggle={setEnabledBudgets}
          >
            <ul className="space-y-2 text-sm text-slate-300">
              {summary.budgets.map((budget) => (
                <li key={budget.category} className="flex items-center justify-between rounded-xl border border-slate-900/60 bg-slate-900/40 px-3 py-2">
                  <span>{budget.category}</span>
                  <span className={budget.delta >= 0 ? "text-emerald-300" : "text-rose-300"}>
                    {budget.delta >= 0 ? "+" : ""}
                    ${Math.round(budget.delta).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </PlanSection>
          <PlanSection
            title="Automation rules"
            description="Nudges and transfers Beno will keep in sync."
            enabled={enabledAutomation}
            onToggle={setEnabledAutomation}
          >
            <ul className="space-y-2 text-sm text-slate-300">
              {summary.automationRules.map((rule) => (
                <li key={rule.id} className="flex items-center justify-between rounded-xl border border-slate-900/60 bg-slate-900/40 px-3 py-2">
                  <span>{rule.description}</span>
                  <span className="text-slate-400">{rule.enabled ? "Active" : "Paused"}</span>
                </li>
              ))}
            </ul>
          </PlanSection>
          <PlanSection
            title="Debt payoff"
            description="Schedule extra payments from this scenario."
            enabled={enabledDebt}
            onToggle={setEnabledDebt}
          >
            <ul className="space-y-2 text-sm text-slate-300">
              {summary.debtSchedule.map((item) => (
                <li key={item.month} className="flex items-center justify-between rounded-xl border border-slate-900/60 bg-slate-900/40 px-3 py-2">
                  <span>{item.month}</span>
                  <span className="text-emerald-300">${Math.round(item.amount).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </PlanSection>
          <div className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4 text-xs text-slate-400">
            <p className="font-semibold text-white">Outcome snapshot</p>
            <p>Runway: {result?.runwayMonths ?? "—"} months</p>
            <p>Final balance: ${result?.monthly.at(-1)?.balance?.toLocaleString() ?? "—"}</p>
            <p>Risk score: {result?.riskScore ?? "—"}</p>
          </div>
        </div>
        <SheetFooter className="flex flex-col gap-3">
          <Button
            onClick={apply}
            disabled={isApplying}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 text-slate-950 shadow-lg shadow-emerald-900/40 hover:shadow-2xl"
          >
            {isApplying ? "Applying..." : "Apply changes"}
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl text-slate-300">
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

interface PlanSectionProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  children: React.ReactNode;
}

function PlanSection({ title, description, enabled, onToggle, children }: PlanSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled ? children : <p className="text-xs text-slate-500">Disabled for this apply.</p>}
    </section>
  );
}
