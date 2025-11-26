import { useMemo } from "react";
import { Overview } from "@/lib/graph/types";
import { GoalDoc, EventDoc } from "@/lib/schemas";
import { useBridge } from "@/lib/hooks/useBridge";

export type LifeScoreBreakdown = {
  finance: number;
  time: number;
  health: number;
  mission: number;
};

export type LifeScoreResult = {
  score: number;
  status: "optimal" | "steady" | "critical";
  accent: string;
  breakdown: LifeScoreBreakdown;
};

const clamp = (value: number, min = 35, max = 100) => Math.min(max, Math.max(min, Math.round(value)));

function computeFinance(overview?: Overview) {
  if (!overview) return 60;
  const runway = overview.cashOnHand.runwayDays;
  const burnDelta = overview.monthlyBurn.target === 0 ? 0 : (overview.monthlyBurn.target - overview.monthlyBurn.actual) / overview.monthlyBurn.target;
  const savings = overview.savingsProgress.percent;
  return clamp(65 + runway / 4 + burnDelta * 15 + savings / 12);
}

function computeTime(events?: EventDoc[]) {
  if (!events?.length) return 55;
  const protectedBlocks = events.filter((event) => event.title?.toLowerCase()?.includes("deep") || event.description?.includes("protected"));
  const completionBias = events.filter((event) => event.status === "done").length / events.length;
  return clamp(60 + protectedBlocks.length * 4 + completionBias * 25);
}

function computeHealth(overview?: Overview) {
  if (!overview?.adherence) return 58;
  const adherence = overview.adherence.percent30d;
  const supply = overview.adherence.onHandDays ?? 7;
  return clamp(55 + adherence / 2 + supply * 0.8);
}

function computeMission(goals?: GoalDoc[], overview?: Overview) {
  const tracked = goals?.length ?? 0;
  const progress = goals?.reduce((sum, goal) => sum + (goal.current / Math.max(goal.target || 1, 1)) * 100, 0) ?? 0;
  const overviewBoost = overview?.goals.top.reduce((sum, goal) => sum + goal.percent, 0) ?? 0;
  if (!tracked) return clamp(60 + (overviewBoost || 12) / 3);
  return clamp(62 + progress / Math.max(tracked, 1) / 2 + overviewBoost / 10);
}

export function calculateUnifiedLifeScore({
  overview,
  goals,
  events,
}: {
  overview?: Overview;
  goals?: GoalDoc[];
  events?: EventDoc[];
}): LifeScoreResult {
  const finance = computeFinance(overview);
  const time = computeTime(events);
  const health = computeHealth(overview);
  const mission = computeMission(goals, overview);
  const score = clamp((finance + time + health + mission) / 4);

  const status = score >= 80 ? "optimal" : score >= 65 ? "steady" : "critical";
  const accent = status === "optimal" ? "emerald" : status === "steady" ? "sky" : "amber";

  return {
    score,
    status,
    accent,
    breakdown: { finance, time, health, mission },
  };
}

export function useUnifiedLifeScore(): LifeScoreResult {
  const { overview, goals, events } = useBridge();

  return useMemo(() => calculateUnifiedLifeScore({ overview, goals, events }), [overview, goals, events]);
}
