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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FundingAccount, Goal } from "@/lib/goals/types";
import { cn } from "@/lib/utils";

interface FundGoalDialogProps {
  goal: Goal | null;
  accounts: FundingAccount[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFund: (payload: { amount: number; sourceAccountId: string; date?: string; note?: string }) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function FundGoalDialog({ goal, accounts, open, onOpenChange, onFund, isSubmitting }: FundGoalDialogProps) {
  const [source, setSource] = useState(accounts[0]?.id ?? "");
  const [amount, setAmount] = useState("250");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("Accelerated contribution");

  useEffect(() => {
    if (accounts.length && !source) {
      setSource(accounts[0].id);
    }
  }, [accounts, source]);

  useEffect(() => {
    if (!open) {
      setAmount("250");
      setDate(new Date().toISOString().slice(0, 10));
      setNote("Accelerated contribution");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg rounded-3xl border border-slate-900/70 bg-slate-950/90 p-0 text-slate-100">
        <DialogHeader className="space-y-2 border-b border-slate-900/60 bg-slate-950/80 px-6 py-4">
          <DialogTitle className="text-xl font-semibold text-white">Fund goal</DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Send a manual boost from a linked account. Beno recalculates timeline instantly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 px-6 py-6">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100">
            {goal ? (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-cyan-300/80">{goal.name}</span>
                <span className="text-lg font-semibold text-white">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: goal.currency ?? "USD" }).format(goal.current)}
                  <span className="text-sm text-cyan-200/70"> / {new Intl.NumberFormat("en-US", { style: "currency", currency: goal.currency ?? "USD" }).format(goal.target)}</span>
                </span>
                <span className="text-xs text-cyan-200/70">Remaining {new Intl.NumberFormat("en-US", { style: "currency", currency: goal.currency ?? "USD" }).format(Math.max(0, goal.target - goal.current))}</span>
              </div>
            ) : (
              "Select a goal"
            )}
          </div>
          <div className="space-y-2">
            <Label>Source account</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="rounded-2xl border border-slate-800 bg-slate-900/60">
                <SelectValue placeholder="Select account" />
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={event => setAmount(event.target.value)}
                className="rounded-2xl border border-slate-800 bg-slate-900/60"
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={event => setDate(event.target.value)} className="rounded-2xl border border-slate-800 bg-slate-900/60" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Note</Label>
            <Textarea value={note} onChange={event => setNote(event.target.value)} rows={3} className="rounded-2xl border border-slate-800 bg-slate-900/60" />
          </div>
        </div>
        <DialogFooter className="border-t border-slate-900/60 bg-slate-950/80 px-6 py-4">
          <Button
            className={cn("rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 text-slate-950 shadow-lg shadow-cyan-900/40", isSubmitting && "opacity-80")}
            disabled={isSubmitting || !goal || Number(amount) <= 0 || !source}
            onClick={async () => {
              if (!goal) return;
              await onFund({ amount: Number(amount), sourceAccountId: source, date, note });
              onOpenChange(false);
            }}
          >
            {isSubmitting ? "Allocating..." : "Allocate funds"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
