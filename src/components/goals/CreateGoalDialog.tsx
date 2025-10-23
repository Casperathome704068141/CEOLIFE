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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Goal, GoalPriority, GoalType } from "@/lib/goals/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Link2 } from "lucide-react";

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: Partial<Goal>) => Promise<unknown>;
  isSubmitting?: boolean;
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

interface GoalFormState {
  name: string;
  type: GoalType;
  target: string;
  currency: string;
  deadline: string;
  priority: GoalPriority;
  linkedEntity: string;
  linkedEntityType: Goal["linkedEntity"] extends infer Entity | undefined
    ? Entity extends { type: infer Type }
      ? Type extends string
        ? Type
        : "bill"
      : "bill"
    : "bill";
  notes: string;
}

const defaultState: GoalFormState = {
  name: "",
  type: "financial",
  target: "5000",
  currency: "USD",
  deadline: "",
  priority: "medium",
  linkedEntity: "",
  linkedEntityType: "bill",
  notes: "",
};

export function CreateGoalDialog({ open, onOpenChange, onCreate, isSubmitting }: CreateGoalDialogProps) {
  const [state, setState] = useState<GoalFormState>(defaultState);

  useEffect(() => {
    if (!open) {
      setState(defaultState);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950/90 p-0 text-slate-100">
        <DialogHeader className="border-b border-slate-800/60 bg-slate-950/80 px-6 py-4">
          <DialogTitle className="text-xl font-semibold text-white">Create mission goal</DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Define the outcome and let Beno orchestrate funding, reminders, and linked automations.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 px-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="goal-name">Goal name</Label>
              <Input
                id="goal-name"
                placeholder="Emergency buffer, trip fund, renovation..."
                value={state.name}
                onChange={event => setState(prev => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Goal type</Label>
                <Select value={state.type} onValueChange={value => setState(prev => ({ ...prev, type: value as GoalType }))}>
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
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={state.priority} onValueChange={value => setState(prev => ({ ...prev, priority: value as GoalPriority }))}>
                  <SelectTrigger className="rounded-2xl border border-slate-800 bg-slate-900/60">
                    <SelectValue placeholder="Priority" />
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
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Target amount</Label>
                <Input
                  type="number"
                  min={0}
                  value={state.target}
                  onChange={event => setState(prev => ({ ...prev, target: event.target.value }))}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60"
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input
                  value={state.currency}
                  onChange={event => setState(prev => ({ ...prev, currency: event.target.value.toUpperCase().slice(0, 3) }))}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label className="inline-flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> Deadline</Label>
                <Input
                  type="date"
                  value={state.deadline}
                  onChange={event => setState(prev => ({ ...prev, deadline: event.target.value }))}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="inline-flex items-center gap-1"><Link2 className="h-3 w-3" /> Link existing entity</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <Select
                  value={state.linkedEntityType}
                  onValueChange={value => setState(prev => ({ ...prev, linkedEntityType: value as GoalFormState["linkedEntityType"] }))}
                >
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
                  placeholder="Search entity or paste reference"
                  value={state.linkedEntity}
                  onChange={event => setState(prev => ({ ...prev, linkedEntity: event.target.value }))}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60"
                />
              </div>
              <p className="text-xs text-slate-500">Optional: attach an existing bill, asset, or wellness routine so Beno can sync context.</p>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Milestones, constraints, or team reminders"
                className="rounded-2xl border border-slate-800 bg-slate-900/60"
                rows={4}
                value={state.notes}
                onChange={event => setState(prev => ({ ...prev, notes: event.target.value }))}
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="border-t border-slate-800/60 bg-slate-950/80 px-6 py-4">
          <Button
            className={cn("rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-900/40", isSubmitting && "opacity-80")}
            disabled={isSubmitting || !state.name || Number(state.target) <= 0}
            onClick={async () => {
              await onCreate({
                name: state.name,
                type: state.type,
                target: Number(state.target),
                currency: state.currency,
                deadline: state.deadline ? new Date(state.deadline).toISOString() : undefined,
                priority: state.priority,
                notes: state.notes,
                linkedEntity: state.linkedEntity
                  ? { type: state.linkedEntityType, id: state.linkedEntity, label: state.linkedEntity }
                  : undefined,
              });
              onOpenChange(false);
            }}
          >
            {isSubmitting ? "Saving..." : "Create goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
