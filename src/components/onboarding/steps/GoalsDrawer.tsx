"use client";

import { useCallback, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/lib/onboarding/state";
import { persistSetup, requestPreview } from "@/lib/onboarding/client";
import { useToast } from "@/hooks/use-toast";

interface GoalsDrawerProps {
  open: boolean;
  onClose: () => void;
}

type GoalForm = {
  name: string;
  target: number;
  deadline?: string;
  priority: number;
  allocation?: number;
};

const quickGoals: Array<{ name: string; target: number; description: string }> = [
  { name: "Emergency fund", target: 5000, description: "Cover 3 months of expenses." },
  { name: "Travel", target: 3000, description: "Plan your next adventure." },
  { name: "New car", target: 20000, description: "Start saving for your next vehicle." },
];

export function GoalsDrawer({ open, onClose }: GoalsDrawerProps) {
  const { toast } = useToast();
  const setup = useOnboardingStore((state) => state.setup);
  const updateData = useOnboardingStore((state) => state.updateData);
  const setPreview = useOnboardingStore((state) => state.setPreview);

  const [goals, setGoals] = useState<GoalForm[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const current = setup.data.goals ?? [];
    setGoals(current.map((goal) => ({ ...goal, allocation: 10 })));
  }, [open, setup.data.goals]);

  const addGoal = (goal?: GoalForm) => {
    setGoals((prev) => [...prev, goal ?? { name: "", target: 0, priority: 3 }]);
  };

  const updateGoal = (index: number, patch: Partial<GoalForm>) => {
    setGoals((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const formatted = goals.filter((goal) => goal.name.trim()).map((goal) => ({
        name: goal.name,
        target: goal.target,
        deadline: goal.deadline,
        priority: goal.priority,
      }));
      updateData("goals", { goals: formatted } as any);
      const latest = useOnboardingStore.getState().setup;
      const response = await persistSetup(latest, false);
      const preview = await requestPreview(response.setup);
      setPreview({
        readiness: preview.readiness,
        financeForecast: preview.finance?.forecast ?? [],
        upcomingBills: preview.finance?.bills ?? [],
        care: preview.care ?? [],
        rules: preview.rules ?? [],
      });
      toast({ title: "Goals saved", description: `${formatted.length} goals configured.` });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [goals, onClose, setPreview, toast, updateData]);

  useEffect(() => {
    const listener = () => {
      if (open) {
        handleSave();
      }
    };
    window.addEventListener("onboarding-save" as any, listener);
    return () => window.removeEventListener("onboarding-save" as any, listener);
  }, [handleSave, open]);

  return (
    <Sheet open={open} onOpenChange={(value) => !value && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Goals</SheetTitle>
          <SheetDescription>Create savings goals and optional auto-funding.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <section className="grid gap-3 md:grid-cols-3">
            {quickGoals.map((quick) => (
              <button
                key={quick.name}
                type="button"
                onClick={() =>
                  addGoal({
                    name: quick.name,
                    target: quick.target,
                    priority: 2,
                    allocation: 15,
                  })
                }
                className="rounded-lg border border-border/60 bg-background/60 p-4 text-left text-sm hover:border-emerald-400"
              >
                <div className="font-semibold">{quick.name}</div>
                <div className="text-xs text-muted-foreground">{quick.description}</div>
              </button>
            ))}
          </section>
          <section className="space-y-4">
            {goals.map((goal, index) => (
              <div key={`goal-${index}`} className="rounded-lg border border-border/70 p-4">
                <div className="grid gap-2 md:grid-cols-2">
                  <Input
                    value={goal.name}
                    placeholder="Goal name"
                    onChange={(event) => updateGoal(index, { name: event.target.value })}
                  />
                  <Input
                    type="number"
                    value={goal.target}
                    onChange={(event) => updateGoal(index, { target: Number(event.target.value) })}
                    placeholder="Target amount"
                  />
                  <Input
                    type="date"
                    value={goal.deadline ?? ""}
                    onChange={(event) => updateGoal(index, { deadline: event.target.value })}
                  />
                  <Input
                    type="number"
                    value={goal.priority}
                    onChange={(event) => updateGoal(index, { priority: Number(event.target.value) })}
                    placeholder="Priority 1-5"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <label className="text-xs uppercase text-muted-foreground">
                    Auto-fund on payday (% allocation)
                  </label>
                  <Input
                    type="number"
                    className="w-24"
                    value={goal.allocation ?? 0}
                    onChange={(event) => updateGoal(index, { allocation: Number(event.target.value) })}
                  />
                </div>
                <div className="mt-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setGoals((prev) => prev.filter((_, idx) => idx !== index))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            {!goals.length && <p className="text-sm text-muted-foreground">No goals yet.</p>}
            <Button variant="secondary" onClick={() => addGoal()}>
              Add manual goal
            </Button>
          </section>
        </div>
        <SheetFooter className="mt-8">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Discard
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            Save & close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
