"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DebtAccount {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
}

const sampleDebts: DebtAccount[] = [
  { id: "card-1", name: "SkyBlue Rewards", balance: 5400, apr: 19.9, minPayment: 110 },
  { id: "auto-1", name: "Riviera Auto", balance: 9800, apr: 4.2, minPayment: 220 },
  { id: "loan-1", name: "Student Loan B", balance: 14200, apr: 5.8, minPayment: 190 },
];

interface DebtPayoffPlannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyToParameters: (amount: number) => void;
  onCreatePlan: (schedule: Array<{ id: string; amount: number }>) => void;
}

export function DebtPayoffPlanner({ open, onOpenChange, onApplyToParameters, onCreatePlan }: DebtPayoffPlannerProps) {
  const [selected, setSelected] = useState<string[]>(sampleDebts.map((debt) => debt.id));
  const [strategy, setStrategy] = useState<"avalanche" | "snowball">("avalanche");
  const [extraPayment, setExtraPayment] = useState(300);

  useEffect(() => {
    if (open) {
      setSelected(sampleDebts.map((debt) => debt.id));
      setStrategy("avalanche");
      setExtraPayment(300);
    }
  }, [open]);

  const summary = useMemo(() => {
    const debts = sampleDebts.filter((debt) => selected.includes(debt.id));
    const interestSaved = Math.round(extraPayment * debts.length * 0.4);
    const months = Math.max(6, Math.round((debts.reduce((sum, debt) => sum + debt.balance, 0) / (extraPayment + 1)) / 4));
    return { debts, interestSaved, months };
  }, [selected, extraPayment]);

  const createPlan = () => {
    const schedule = summary.debts.map((debt) => ({
      id: debt.id,
      amount: Math.round(extraPayment / Math.max(summary.debts.length, 1)),
    }));
    onCreatePlan(schedule);
    onApplyToParameters(extraPayment);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl border border-slate-900/80 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle>Debt payoff planner</DialogTitle>
          <DialogDescription>Choose focus accounts and route extra cash using avalanche or snowball tactics.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-400">Debts</Label>
              {sampleDebts.map((debt) => (
                <label
                  key={debt.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-900/70 bg-slate-900/40 px-4 py-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selected.includes(debt.id)}
                        onCheckedChange={(checked) => {
                          setSelected((prev) =>
                            checked ? [...prev, debt.id] : prev.filter((existing) => existing !== debt.id),
                          );
                        }}
                      />
                      <span className="text-sm font-semibold text-white">{debt.name}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      ${debt.balance.toLocaleString()} · APR {debt.apr}% · Min ${debt.minPayment}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-2 text-xs text-slate-400">
              <Button
                variant={strategy === "avalanche" ? "default" : "secondary"}
                onClick={() => setStrategy("avalanche")}
                className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
              >
                Avalanche (highest APR first)
              </Button>
              <Button
                variant={strategy === "snowball" ? "default" : "secondary"}
                onClick={() => setStrategy("snowball")}
                className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
              >
                Snowball (smallest balance)
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-400">Extra payment per month</Label>
              <Slider value={[extraPayment]} min={0} max={1200} step={50} onValueChange={([value]) => setExtraPayment(value)} />
              <p className="text-xs text-slate-400">${extraPayment} per month routed to {strategy} stack.</p>
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-900/70 bg-slate-900/40 p-4">
            <p className="text-sm font-semibold text-white">Projection</p>
            <p className="text-xs text-slate-400">Debts selected: {summary.debts.length}</p>
            <p className="text-xs text-slate-400">Estimated payoff: {summary.months} months</p>
            <p className="text-xs text-slate-400">Interest saved: ${summary.interestSaved.toLocaleString()}</p>
            <p className="text-xs text-slate-500">
              Beno will schedule transfers aligned with your extra payment and surface automation rules in Apply Plan.
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-3">
          <Button onClick={createPlan} className="rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 text-slate-950 shadow-lg shadow-emerald-900/40 hover:shadow-2xl">
            Create plan
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onApplyToParameters(extraPayment);
              onOpenChange(false);
            }}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
          >
            Apply to parameters only
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
