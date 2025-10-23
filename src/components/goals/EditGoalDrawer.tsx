"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Goal, GoalPriority, GoalType } from "@/lib/goals/types";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Link2, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditGoalDrawerProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: Partial<Goal>) => Promise<unknown>;
  onArchive: () => Promise<unknown>;
  focusSection?: "link" | "overview";
}

const goalTypes: { label: string; value: GoalType }[] = [
  { label: "Financial", value: "financial" },
  { label: "Household", value: "household" },
  { label: "Education", value: "education" },
  { label: "Travel", value: "travel" },
  { label: "Health", value: "health" },
  { label: "Other", value: "other" },
];

const priorities: { label: string; value: GoalPriority }[] = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export function EditGoalDrawer({ goal, open, onOpenChange, onSave, onArchive, focusSection = "overview" }: EditGoalDrawerProps) {
  const [name, setName] = useState(goal?.name ?? "");
  const [target, setTarget] = useState(goal?.target.toString() ?? "0");
  const [deadline, setDeadline] = useState<string>(goal?.deadline ? new Date(goal.deadline).toISOString().slice(0, 10) : "");
  const [priority, setPriority] = useState<GoalPriority>(goal?.priority ?? "medium");
  const [type, setType] = useState<GoalType>(goal?.type ?? "financial");
  const [notes, setNotes] = useState(goal?.notes ?? "");
  const [linkedLabel, setLinkedLabel] = useState(goal?.linkedEntity?.label ?? "");
  const [linkedType, setLinkedType] = useState<Goal["linkedEntity"] extends infer Entity | undefined
    ? Entity extends { type: infer Type }
      ? Type extends string
        ? Type
        : "bill"
      : "bill"
    : "bill">(goal?.linkedEntity?.type ?? "bill");

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTarget(goal.target.toString());
      setDeadline(goal.deadline ? new Date(goal.deadline).toISOString().slice(0, 10) : "");
      setPriority(goal.priority);
      setType(goal.type);
      setNotes(goal.notes ?? "");
      setLinkedLabel(goal.linkedEntity?.label ?? goal.linkedEntity?.id ?? "");
      setLinkedType(goal.linkedEntity?.type ?? "bill");
    }
  }, [goal]);

  const progress = useMemo(() => (goal && goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0), [goal]);
  const amountLeft = useMemo(() => (goal ? Math.max(0, goal.target - goal.current) : 0), [goal]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-xl border-l border-slate-900/70 bg-slate-950/90 text-slate-100">
        <SheetHeader>
          <SheetTitle className="text-white">Mission control</SheetTitle>
          <SheetDescription className="text-slate-400">
            Adjust parameters, link context, or hand off to automations.
          </SheetDescription>
        </SheetHeader>
        {goal ? (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 rounded-3xl border border-slate-900/60 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                  <p className="text-xs text-slate-400">{goal.type} goal · {goal.currency ?? "USD"}</p>
                </div>
                <Badge className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs text-cyan-100">{progress}%</Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <div>
                  <span className="font-medium text-white">{goal.current.toLocaleString(undefined, { style: "currency", currency: goal.currency ?? "USD" })}</span>
                  <span className="text-xs text-slate-500"> / {goal.target.toLocaleString(undefined, { style: "currency", currency: goal.currency ?? "USD" })}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Target className="h-3 w-3" /> Remaining {goal.currency ? new Intl.NumberFormat("en-US", { style: "currency", currency: goal.currency }).format(amountLeft) : amountLeft.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={event => setName(event.target.value)} className="rounded-2xl border border-slate-800 bg-slate-900/60" />
                </div>
                <div className="space-y-2">
                  <Label>Target</Label>
                  <Input value={target} onChange={event => setTarget(event.target.value)} type="number" className="rounded-2xl border border-slate-800 bg-slate-900/60" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={value => setPriority(value as GoalPriority)}>
                    <SelectTrigger className="rounded-2xl border border-slate-800 bg-slate-900/60">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-slate-800 bg-slate-950/95">
                      {priorities.map(item => (
                        <SelectItem key={item.value} value={item.value} className="capitalize">
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Goal type</Label>
                  <Select value={type} onValueChange={value => setType(value as GoalType)}>
                    <SelectTrigger className="rounded-2xl border border-slate-800 bg-slate-900/60">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-slate-800 bg-slate-950/95">
                      {goalTypes.map(item => (
                        <SelectItem key={item.value} value={item.value} className="capitalize">
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="inline-flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> Deadline</Label>
                  <Input value={deadline} onChange={event => setDeadline(event.target.value)} type="date" className="rounded-2xl border border-slate-800 bg-slate-900/60" />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                    {goal.current >= goal.target ? "Completed" : goal.archived ? "Archived" : "Active"}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={notes} onChange={event => setNotes(event.target.value)} className="rounded-2xl border border-slate-800 bg-slate-900/60" rows={4} />
              </div>
              <div className={cn("space-y-3", focusSection === "link" && "ring-2 ring-cyan-400/40 rounded-3xl p-3 -mx-3 bg-slate-900/40")}> 
                <Label className="inline-flex items-center gap-2 text-sm font-medium text-slate-200">
                  <Link2 className="h-4 w-4 text-cyan-300" /> Linked entity
                </Label>
                <div className="grid gap-3 md:grid-cols-2">
                  <Select value={linkedType} onValueChange={value => setLinkedType(value as typeof linkedType)}>
                    <SelectTrigger className="rounded-2xl border border-slate-800 bg-slate-900/60">
                      <SelectValue placeholder="Entity type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-slate-800 bg-slate-950/95">
                      <SelectItem value="bill">Bill</SelectItem>
                      <SelectItem value="asset">Asset</SelectItem>
                      <SelectItem value="habit">Habit</SelectItem>
                      <SelectItem value="medication">Medication</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Entity ID or name"
                    value={linkedLabel}
                    onChange={event => setLinkedLabel(event.target.value)}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60"
                  />
                </div>
                <p className="text-xs text-slate-500">Attach a data source so Beno can sync actual spend, adherence, or meter readings.</p>
              </div>
              <div className="rounded-3xl border border-slate-900/60 bg-slate-950/60 p-4 text-sm text-slate-300">
                <p className="mb-2 flex items-center gap-2 font-medium text-white">
                  <Sparkles className="h-4 w-4 text-cyan-300" /> Automation state
                </p>
                {goal.autoFundRule ? (
                  <p className="text-xs text-slate-400">
                    {`$${goal.autoFundRule.amount} ${goal.autoFundRule.frequency} from ${goal.autoFundRule.sourceAccountId}.`}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">No automation yet. Enable auto-funding from the card actions.</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-900/60 pt-4">
              <Button
                className="rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-900/40"
                disabled={!name.trim() || Number(target) <= 0}
                onClick={async () => {
                  await onSave({
                    name: name.trim(),
                    target: Number(target),
                    deadline: deadline ? new Date(deadline).toISOString() : undefined,
                    priority,
                    type,
                    notes,
                    linkedEntity: linkedLabel
                      ? { type: linkedType, id: linkedLabel, label: linkedLabel }
                      : undefined,
                  });
                  onOpenChange(false);
                }}
              >
                Save updates
              </Button>
              <Button
                variant="ghost"
                className="rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                onClick={async () => {
                  await onArchive();
                  onOpenChange(false);
                }}
              >
                Archive goal
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
