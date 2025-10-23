"use client";

import { Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoalCard } from "./GoalCard";
import type { Goal } from "@/lib/goals/types";
import { Rocket, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoalGridProps {
  groupedGoals: Record<string, Goal[]>;
  grouping: "none" | "type" | "priority";
  onFund: (goal: Goal) => void;
  onEdit: (goal: Goal, intent?: "link") => void;
  onSimulate: (goal: Goal) => void;
  onAutoFund: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onCreateGoal: () => void;
  isLoading?: boolean;
}

const headings: Record<string, string> = {
  financial: "Finance & savings",
  household: "Household",
  education: "Education",
  travel: "Travel",
  health: "Health & wellness",
  other: "Other",
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

export function GoalGrid({
  groupedGoals,
  grouping,
  onFund,
  onEdit,
  onSimulate,
  onAutoFund,
  onDelete,
  onCreateGoal,
  isLoading,
}: GoalGridProps) {
  const groups = Object.entries(groupedGoals);
  const hasGoals = groups.some(([, list]) => list.length > 0);

  if (!hasGoals && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-900/60 bg-slate-950/60 p-12 text-center text-slate-300 shadow-inner shadow-slate-900/40">
        <Rocket className="h-10 w-10 text-cyan-400" />
        <h3 className="mt-4 text-xl font-semibold text-white">Set your first mission</h3>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          Goals combine finance, household, and wellness signals so Beno can automate your progress. Start by creating a goal and linking a funding source.
        </p>
        <Button className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-900/40" onClick={onCreateGoal}>
          Launch a goal
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={120}>
      <div className="space-y-8">
        {groups.map(([key, goals]) => {
          if (!goals.length) return null;
          const title = grouping === "none" ? undefined : headings[key] ?? key;
          return (
            <Fragment key={key}>
              {title ? (
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{title}</h3>
                  <span className="text-xs text-slate-500">{goals.length} goal{goals.length === 1 ? "" : "s"}</span>
                </div>
              ) : null}
              <motion.div
                layout
                className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
              >
                <AnimatePresence>
                  {goals.map(goal => (
                    <motion.div key={goal.id} layout variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                      <GoalCard
                        goal={goal}
                        onFund={onFund}
                        onEdit={onEdit}
                        onSimulate={onSimulate}
                        onAutoFund={onAutoFund}
                        onDelete={onDelete}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </Fragment>
          );
        })}
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Target className="h-4 w-4 animate-spin" /> Loading goals...
          </div>
        ) : null}
      </div>
    </TooltipProvider>
  );
}
