"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Goal } from "@/lib/goals/types";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Coins, Link2, Settings2, Sparkles, Trash2, Wallet, Wand2 } from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  onFund: (goal: Goal) => void;
  onEdit: (goal: Goal, intent?: "link") => void;
  onSimulate: (goal: Goal) => void;
  onAutoFund: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  className?: string;
}

const priorityVariants: Record<Goal["priority"], string> = {
  high: "bg-rose-500/20 text-rose-200 border border-rose-400/40",
  medium: "bg-amber-500/10 text-amber-200 border border-amber-300/30",
  low: "bg-emerald-500/10 text-emerald-200 border border-emerald-300/20",
};

function computeTrend(goal: Goal) {
  const daysSinceUpdate = Math.round((Date.now() - new Date(goal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
  const progress = goal.target > 0 ? goal.current / goal.target : 0;
  if (progress >= 0.95) return "improving" as const;
  if (daysSinceUpdate <= 7 && progress >= 0.4) return "improving" as const;
  if (daysSinceUpdate > 30) return "regressing" as const;
  if (progress < 0.2) return "regressing" as const;
  return "stagnant" as const;
}

function formatCurrency(goal: Goal, amount: number) {
  const currency = goal.currency ?? "USD";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function GoalCard({ goal, onFund, onEdit, onSimulate, onAutoFund, onDelete, className }: GoalCardProps) {
  const progressRaw = goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;
  const progress = Number.isFinite(progressRaw) ? progressRaw : 0;
  const progressMotion = useSpring(progress, { stiffness: 120, damping: 18 });
  useEffect(() => {
    progressMotion.set(progress);
  }, [progress, progressMotion]);
  const displayProgress = useTransform(progressMotion, latest => Math.min(100, Math.max(0, latest)).toFixed(0));
  const [progressText, setProgressText] = useState(progress.toFixed(0));

  useEffect(() => {
    const unsubscribe = displayProgress.on("change", value => {
      setProgressText(value);
    });
    return unsubscribe;
  }, [displayProgress]);

  const amountLeft = Math.max(0, goal.target - goal.current);
  const deadline = goal.deadline ? new Date(goal.deadline) : undefined;
  const daysUntilDeadline = deadline ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : undefined;
  const trend = computeTrend(goal);
  const ringColor = goal.color ?? "#38bdf8";

  const TrendIcon = trend === "improving" ? ArrowUpRight : trend === "regressing" ? ArrowDownRight : ArrowRight;
  const trendColor = trend === "improving" ? "text-emerald-300" : trend === "regressing" ? "text-rose-300" : "text-slate-300";
  const deadlineBadge = (() => {
    if (!deadline || Number.isNaN(deadline.getTime())) return null;
    if (daysUntilDeadline === undefined) return null;
    if (daysUntilDeadline < 0) {
      return <Badge className="rounded-xl border border-rose-500/40 bg-rose-500/20 text-xs text-rose-200">Missed deadline</Badge>;
    }
    if (daysUntilDeadline <= 14) {
      return (
        <Badge className="rounded-xl border border-amber-500/40 bg-amber-500/20 text-xs text-amber-200">
          Due in {daysUntilDeadline}d
        </Badge>
      );
    }
    return (
      <Badge className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs text-cyan-100">
        {deadline.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
      </Badge>
    );
  })();

  return (
    <motion.div
      layout
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-slate-900/70 bg-slate-950/70 p-5 text-slate-100 shadow-lg transition",
        "hover:border-cyan-500/40 hover:shadow-cyan-500/20",
        className,
      )}
      whileHover={{ scale: 1.01 }}
      onClick={() => onEdit(goal)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-indigo-500/5 opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-lg text-white">{goal.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1"><Wallet className="h-3 w-3" />{goal.type}</span>
              {goal.linkedEntity ? (
                <span className="inline-flex items-center gap-1 text-cyan-200">
                  <Link2 className="h-3 w-3" />
                  {goal.linkedEntity.label ?? goal.linkedEntity.type}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={cn("rounded-xl text-xs capitalize", priorityVariants[goal.priority])}>{goal.priority} priority</Badge>
            {deadlineBadge}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at center, rgba(15,23,42,0.9) 60%, transparent 61%), conic-gradient(${ringColor} ${progress * 3.6}deg, rgba(30,41,59,0.6) ${progress * 3.6}deg)`,
              }}
            />
            <div className="absolute inset-4 rounded-full bg-slate-950/90 shadow-inner shadow-cyan-500/10" />
            <span className="relative text-3xl font-bold text-white">
              {progressText}
              <span className="ml-1 text-sm font-normal text-slate-400">%</span>
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">Progress</p>
              <p className="text-xl font-semibold text-white">
                {formatCurrency(goal, goal.current)}
                <span className="text-sm text-slate-500"> / {formatCurrency(goal, goal.target)}</span>
              </p>
              <p className="text-xs text-slate-400">Remaining {formatCurrency(goal, amountLeft)}</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-1", trendColor, "border-white/10 bg-white/5")}>
                <TrendIcon className="h-3 w-3" />
                {trend === "improving" ? "Improving" : trend === "regressing" ? "At risk" : "Stagnant"}
              </span>
              {goal.autoFundRule ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-cyan-200">
                  <Sparkles className="h-3 w-3" /> Auto
                </span>
              ) : null}
            </div>
            {goal.notes ? (
              <p className="mt-1 line-clamp-2 text-xs text-slate-400">{goal.notes}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="absolute inset-x-4 bottom-4 flex translate-y-6 justify-between gap-2 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="pointer-events-auto rounded-2xl bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30"
                onClick={event => {
                  event.stopPropagation();
                  onFund(goal);
                }}
              >
                <Coins className="mr-2 h-4 w-4" /> Fund
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Allocate money to this goal</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="pointer-events-auto rounded-2xl bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                onClick={event => {
                  event.stopPropagation();
                  onSimulate(goal);
                }}
              >
                <Wand2 className="mr-2 h-4 w-4" /> Simulate
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Run a what-if projection</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="pointer-events-auto rounded-2xl bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                onClick={event => {
                  event.stopPropagation();
                  onAutoFund(goal);
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" /> Auto fund
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Create a recurring transfer</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="pointer-events-auto rounded-2xl border border-slate-700 bg-slate-900/70 hover:bg-slate-800"
                onClick={event => {
                  event.stopPropagation();
                  onEdit(goal, "link");
                }}
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Link entity</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="pointer-events-auto rounded-2xl border border-slate-700 bg-slate-900/70 hover:bg-slate-800"
                onClick={event => {
                  event.stopPropagation();
                  onEdit(goal);
                }}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Edit goal</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="pointer-events-auto rounded-2xl border border-slate-800 bg-slate-900/70 text-rose-300 hover:bg-rose-500/20"
                onClick={event => {
                  event.stopPropagation();
                  onDelete(goal);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Archive goal</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
}
