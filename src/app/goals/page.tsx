"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { GoalGrid } from "@/components/goals/GoalGrid";
import { CreateGoalDialog } from "@/components/goals/CreateGoalDialog";
import { FundGoalDialog } from "@/components/goals/FundGoalDialog";
import { AutoFundRuleDialog } from "@/components/goals/AutoFundRuleDialog";
import { SimulationDrawer } from "@/components/goals/SimulationDrawer";
import { EditGoalDrawer } from "@/components/goals/EditGoalDrawer";
import { GoalAnalyticsSidebar } from "@/components/goals/GoalAnalyticsSidebar";
import { useGoals } from "@/lib/goals/useGoals";
import type { Goal, GoalPriority, GoalSortOption, GoalType } from "@/lib/goals/types";
import { useToast } from "@/hooks/use-toast";
import { Filter, LayoutGrid, Plus, Wand2 } from "lucide-react";

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

const sortOptions: { value: GoalSortOption; label: string }[] = [
  { value: "deadline", label: "Deadline (soonest)" },
  { value: "progress-desc", label: "Progress (high → low)" },
  { value: "progress-asc", label: "Progress (low → high)" },
  { value: "amount-left", label: "Amount remaining" },
];

export default function GoalsPage() {
  const {
    groupedGoals,
    filteredGoals,
    analytics,
    filters,
    setFilters,
    sort,
    setSort,
    grouping,
    toggleGrouping,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    fundGoal,
    setAutoFundRule,
    runSimulation,
    fundingAccounts,
    suggestion,
    isCreating,
    isFunding,
    isAutomating,
  } = useGoals();
  const { toast } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [editFocus, setEditFocus] = useState<"link" | "overview">("overview");
  const [fundTarget, setFundTarget] = useState<Goal | null>(null);
  const [autoFundTarget, setAutoFundTarget] = useState<Goal | null>(null);
  const [autoFundDefaults, setAutoFundDefaults] = useState<{ amount?: number; frequency?: "weekly" | "biweekly" | "monthly" }>({});
  const [simulateTarget, setSimulateTarget] = useState<Goal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [focusedGoal, setFocusedGoal] = useState<Goal | null>(null);

  useEffect(() => {
    setSuggestionDismissed(false);
  }, [suggestion?.id]);

  const activeFilterCount = filters.types.length + filters.priorities.length + (filters.status !== "active" ? 1 : 0);

  const openAutoFundForGoal = (goal: Goal, defaults?: { amount?: number; frequency?: "weekly" | "biweekly" | "monthly" }) => {
    setAutoFundTarget(goal);
    setAutoFundDefaults(defaults ?? {});
  };

  const closeAutoFund = () => {
    setAutoFundTarget(null);
    setAutoFundDefaults({});
  };

  const handleApplySuggestion = (goal: Goal, amount: number | undefined) => {
    openAutoFundForGoal(goal, { amount, frequency: "weekly" });
  };

  const firstGoal = filteredGoals[0];

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.tagName?.toLowerCase() === "input" || (event.target as HTMLElement)?.tagName?.toLowerCase() === "textarea") {
        return;
      }
      if (event.key === "n" || event.key === "N") {
        event.preventDefault();
        setCreateOpen(true);
      }
      if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        const goal = focusedGoal ?? firstGoal;
        if (goal) {
          setFundTarget(goal);
        }
      }
      if (event.key === "a" || event.key === "A") {
        event.preventDefault();
        const goal = focusedGoal ?? firstGoal;
        if (goal) {
          openAutoFundForGoal(goal);
        }
      }
      if (event.key === "e" || event.key === "E") {
        event.preventDefault();
        const goal = focusedGoal ?? firstGoal;
        if (goal) {
          setEditGoal(goal);
          setEditFocus("overview");
        }
      }
      if (event.key === "s" || event.key === "S") {
        event.preventDefault();
        const goal = focusedGoal ?? firstGoal;
        if (goal) {
          setSimulateTarget(goal);
        }
      }
      if (event.key === "Delete") {
        const goal = focusedGoal ?? firstGoal;
        if (goal) {
          setGoalToDelete(goal);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusedGoal, firstGoal]);

  const handleSimulationApply = (input: { weeklyContribution: number }) => {
    const goal = simulateTarget;
    if (!goal) return;
    openAutoFundForGoal(goal, { amount: Math.round(input.weeklyContribution), frequency: "weekly" });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Goals overview"
        description="Progress rings, target dates, and priority sorting. Beno keeps household, finance, and wellness missions synchronized."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setCreateOpen(true)}
              className="rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 px-6 text-slate-950 shadow-lg shadow-cyan-900/40 hover:shadow-2xl"
            >
              <Plus className="mr-2 h-4 w-4" /> Create goal
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl border-slate-700 bg-slate-900/40 text-slate-100 hover:bg-slate-800"
              onClick={() => {
                if (firstGoal) {
                  openAutoFundForGoal(firstGoal);
                } else {
                  toast({ title: "No goals yet", description: "Create a goal before setting auto-fund rules." });
                }
              }}
            >
              <Wand2 className="mr-2 h-4 w-4" /> Auto fund rule
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-900/60 bg-slate-950/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800">
                    <Filter className="h-4 w-4" /> Filters
                    {activeFilterCount ? <Badge className="rounded-xl bg-cyan-500/20 text-cyan-100">{activeFilterCount}</Badge> : null}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-2xl border border-slate-800 bg-slate-950/95 text-slate-100">
                  <DropdownMenuLabel>Type</DropdownMenuLabel>
                  {goalTypes.map(item => (
                    <DropdownMenuCheckboxItem
                      key={item.value}
                      checked={filters.types.includes(item.value)}
                      onCheckedChange={checked =>
                        setFilters(prev => ({
                          ...prev,
                          types: checked
                            ? [...prev.types, item.value]
                            : prev.types.filter(type => type !== item.value),
                        }))
                      }
                    >
                      {item.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Priority</DropdownMenuLabel>
                  {priorities.map(item => (
                    <DropdownMenuCheckboxItem
                      key={item.value}
                      checked={filters.priorities.includes(item.value)}
                      onCheckedChange={checked =>
                        setFilters(prev => ({
                          ...prev,
                          priorities: checked
                            ? [...prev.priorities, item.value]
                            : prev.priorities.filter(priority => priority !== item.value),
                        }))
                      }
                    >
                      {item.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={filters.status} onValueChange={value => setFilters(prev => ({ ...prev, status: value as typeof prev.status }))}>
                    <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="archived">Archived</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="hidden items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 md:flex">
                <LayoutGrid className="h-3.5 w-3.5 text-cyan-300" />
                {filteredGoals.length} goals filtered
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={event => setSort(event.target.value as GoalSortOption)}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-100"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <GoalGrid
            groupedGoals={groupedGoals}
            grouping={grouping}
            onFund={goal => {
              setFocusedGoal(goal);
              setFundTarget(goal);
            }}
            onEdit={(goal, intent) => {
              setFocusedGoal(goal);
              setEditGoal(goal);
              setEditFocus(intent === "link" ? "link" : "overview");
            }}
            onSimulate={goal => {
              setFocusedGoal(goal);
              setSimulateTarget(goal);
            }}
            onAutoFund={goal => {
              setFocusedGoal(goal);
              openAutoFundForGoal(goal);
            }}
            onDelete={goal => {
              setFocusedGoal(goal);
              setGoalToDelete(goal);
            }}
            onCreateGoal={() => setCreateOpen(true)}
            isLoading={isLoading}
          />
        </div>
        <div className="hidden w-full max-w-xs flex-shrink-0 lg:block">
          <GoalAnalyticsSidebar
            analytics={analytics}
            grouping={grouping}
            onToggleGrouping={toggleGrouping}
            onRunAllSimulations={() => {
              if (firstGoal) {
                setSimulateTarget(firstGoal);
              } else {
                toast({ title: "No goals available", description: "Create a goal to simulate timelines." });
              }
            }}
            suggestion={suggestionDismissed ? null : suggestion}
            onApplySuggestion={item => {
              const goal = filteredGoals.find(g => g.id === item.goalId) ?? firstGoal;
              if (goal) {
                handleApplySuggestion(goal, item.recommendedIncrease);
              }
            }}
            onSimulateSuggestion={item => {
              const goal = filteredGoals.find(g => g.id === item.goalId) ?? firstGoal;
              if (goal) {
                setSimulateTarget(goal);
              }
            }}
          />
        </div>
      </div>

      <AnimatePresence>
        {suggestion && !suggestionDismissed ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="fixed bottom-6 right-6 z-30 max-w-sm rounded-3xl border border-cyan-500/30 bg-slate-950/80 p-5 text-slate-100 shadow-xl backdrop-blur"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">💡 Beno insight</p>
                <p className="mt-1 text-xs text-slate-300">{suggestion.headline}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-slate-400 hover:text-slate-100" onClick={() => setSuggestionDismissed(true)}>
                ×
              </Button>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-slate-950"
                onClick={() => {
                  const goal = filteredGoals.find(g => g.id === suggestion.goalId) ?? firstGoal;
                  if (goal) {
                    handleApplySuggestion(goal, suggestion.recommendedIncrease);
                  }
                  setSuggestionDismissed(true);
                }}
              >
                {suggestion.cta.applyLabel}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 rounded-2xl border border-cyan-500/40 bg-slate-900/60 text-cyan-100 hover:bg-slate-900"
                onClick={() => {
                  const goal = filteredGoals.find(g => g.id === suggestion.goalId) ?? firstGoal;
                  if (goal) {
                    setSimulateTarget(goal);
                  }
                  setSuggestionDismissed(true);
                }}
              >
                {suggestion.cta.simulateLabel}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CreateGoalDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={createGoal}
        isSubmitting={isCreating}
      />
      <EditGoalDrawer
        goal={editGoal}
        open={!!editGoal}
        onOpenChange={open => {
          if (!open) {
            setEditGoal(null);
          }
        }}
        onSave={async payload => {
          if (!editGoal) return;
          await updateGoal({ goalId: editGoal.id, payload });
        }}
        onArchive={async () => {
          if (!editGoal) return;
          await deleteGoal(editGoal.id);
        }}
        focusSection={editFocus}
      />
      <FundGoalDialog
        goal={fundTarget}
        accounts={fundingAccounts}
        open={!!fundTarget}
        onOpenChange={open => {
          if (!open) setFundTarget(null);
        }}
        onFund={async payload => {
          if (!fundTarget) return;
          const goal = await fundGoal({ goalId: fundTarget.id, ...payload });
          toast({
            title: "Contribution added",
            description: `${new Intl.NumberFormat("en-US", { style: "currency", currency: goal.currency ?? "USD" }).format(payload.amount)} allocated to “${goal.name}”.`,
          });
        }}
        isSubmitting={isFunding}
      />
      <AutoFundRuleDialog
        goal={autoFundTarget}
        accounts={fundingAccounts}
        open={!!autoFundTarget}
        onOpenChange={open => {
          if (!open) {
            closeAutoFund();
          }
        }}
        onCreateRule={async payload => {
          if (!autoFundTarget) return;
          await setAutoFundRule({ goalId: autoFundTarget.id, payload });
          toast({ title: "Automation scheduled", description: `Auto-funding enabled for “${autoFundTarget.name}”.` });
          closeAutoFund();
        }}
        initialAmount={autoFundDefaults.amount}
        initialFrequency={autoFundDefaults.frequency}
        isSubmitting={isAutomating}
      />
      <SimulationDrawer
        goal={simulateTarget}
        open={!!simulateTarget}
        onOpenChange={open => {
          if (!open) setSimulateTarget(null);
        }}
        onSimulate={runSimulation}
        onSaveScenario={(result, input) => {
          toast({ title: "Scenario saved", description: `Projected completion in ${result.monthsToTarget} months at $${input.weeklyContribution}/week.` });
        }}
        onApplyAutomation={handleSimulationApply}
        onShare={result => {
          toast({ title: "Share ready", description: `Reach target by ${new Date(result.reachDate).toLocaleDateString()}. Export to PDF from the simulator.` });
        }}
      />
      <AlertDialog open={!!goalToDelete} onOpenChange={open => !open && setGoalToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border border-slate-900/70 bg-slate-950/90 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Archive goal?</AlertDialogTitle>
            <AlertDialogDescription>
              This hides the goal from your dashboard. You can restore it later from the archive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl border border-slate-700 bg-slate-900/60">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-2xl bg-rose-500/80 text-white hover:bg-rose-500"
              onClick={async () => {
                if (goalToDelete) {
                  await deleteGoal(goalToDelete.id);
                  toast({ title: "Goal archived", description: `“${goalToDelete.name}” moved to archive.` });
                }
                setGoalToDelete(null);
              }}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
