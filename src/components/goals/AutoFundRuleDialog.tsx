"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { AutoFundRule, FundingAccount, Goal } from "@/lib/goals/types";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AutoFundRuleDialogProps {
  goal: Goal | null;
  accounts: FundingAccount[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRule: (payload: AutoFundRule & { untilTarget?: boolean; untilDate?: string; note?: string }) => Promise<void>;
  isSubmitting?: boolean;
  initialAmount?: number;
  initialFrequency?: AutoFundRule["frequency"];
}

const frequencies: { label: string; value: AutoFundRule["frequency"] }[] = [
  { label: "Weekly", value: "weekly" },
  { label: "Bi-weekly", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
];

export function AutoFundRuleDialog({ goal, accounts, open, onOpenChange, onCreateRule, isSubmitting, initialAmount, initialFrequency }: AutoFundRuleDialogProps) {
  const [frequency, setFrequency] = useState<AutoFundRule["frequency"]>(initialFrequency ?? "weekly");
  const [amount, setAmount] = useState((initialAmount ?? 100).toString());
  const [source, setSource] = useState(accounts[0]?.id ?? "");
  const [untilTarget, setUntilTarget] = useState(true);
  const [untilDate, setUntilDate] = useState("");
  const [note, setNote] = useState("Auto top-up configured in Goals hub");

  useEffect(() => {
    if (accounts.length && !source) {
      setSource(accounts[0].id);
    }
  }, [accounts, source]);

  useEffect(() => {
    if (initialFrequency) {
      setFrequency(initialFrequency);
    }
  }, [initialFrequency]);

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount.toString());
    }
  }, [initialAmount]);

  useEffect(() => {
    if (!open) {
      setFrequency(initialFrequency ?? "weekly");
      setAmount((initialAmount ?? 100).toString());
      setUntilTarget(true);
      setUntilDate("");
      setNote("Auto top-up configured in Goals hub");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg rounded-3xl border border-slate-900/70 bg-slate-950/90 p-0 text-slate-100">
        <DialogHeader className="space-y-2 border-b border-slate-900/60 bg-slate-950/80 px-6 py-4">
          <DialogTitle className="text-xl font-semibold text-white">Auto-fund rule</DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Beno will execute this cadence and adjust if your income changes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 px-6 py-6">
          {goal ? (
            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/50 px-4 py-3 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-wide text-slate-500">Goal</p>
              <p className="text-base font-semibold text-white">{goal.name}</p>
              <p className="text-xs text-slate-500">Current velocity {(goal.current / Math.max(goal.target, 1) * 100).toFixed(0)}%</p>
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={value => setFrequency(value as AutoFundRule["frequency"])}>
                <SelectTrigger className="rounded-2xl border border-slate-800 bg-slate-900/60">
                  <SelectValue placeholder="Cadence" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border border-slate-800 bg-slate-950/95">
                  {frequencies.map(item => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount per cycle</Label>
              <Input type="number" min={0} value={amount} onChange={event => setAmount(event.target.value)} className="rounded-2xl border border-slate-800 bg-slate-900/60" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Source account</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="rounded-2xl border border-slate-800 bg-slate-900/60">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-slate-800 bg-slate-950/95">
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex flex-col">
                      <span className="text-sm text-white">{account.name}</span>
                      <span className="text-xs text-slate-500">{account.institution} · {account.type}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-900/60 bg-slate-900/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Run until goal reached</p>
                <p className="text-xs text-slate-500">If disabled, you can set an explicit end date.</p>
              </div>
              <Switch checked={untilTarget} onCheckedChange={setUntilTarget} />
            </div>
            {!untilTarget ? (
              <div className="space-y-2">
                <Label>Stop on date</Label>
                <Input type="date" value={untilDate} onChange={event => setUntilDate(event.target.value)} className="rounded-2xl border border-slate-800 bg-slate-900/60" />
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>Operator note</Label>
            <Textarea rows={3} value={note} onChange={event => setNote(event.target.value)} className="rounded-2xl border border-slate-800 bg-slate-900/60" />
          </div>
        </div>
        <DialogFooter className="border-t border-slate-900/60 bg-slate-950/80 px-6 py-4">
          <Button
            className={cn("rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-900/40", isSubmitting && "opacity-80")}
            disabled={!goal || Number(amount) <= 0 || !source || (untilTarget === false && !untilDate) || isSubmitting}
            onClick={async () => {
              if (!goal) return;
              await onCreateRule({
                sourceAccountId: source,
                frequency,
                amount: Number(amount),
                untilTarget,
                untilDate: untilTarget ? undefined : untilDate,
                note,
              });
              onOpenChange(false);
            }}
          >
            {isSubmitting ? "Configuring..." : "Enable automation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
