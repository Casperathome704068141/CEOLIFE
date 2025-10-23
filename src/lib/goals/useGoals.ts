"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type {
  AutomationSuggestion,
  FundingAccount,
  Goal,
  GoalAnalyticsSnapshot,
  GoalFilters,
  GoalSortOption,
  SimulationInput,
  SimulationResult,
} from "./types";

const FILTER_STORAGE_KEY = "ceolife.goals.filters";
const SORT_STORAGE_KEY = "ceolife.goals.sort";
const GROUPING_STORAGE_KEY = "ceolife.goals.grouping";

async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json() as Promise<T>;
}

const defaultFilters: GoalFilters = {
  types: [],
  priorities: [],
  status: "active",
};

const defaultSort: GoalSortOption = "deadline";

type GroupingMode = "none" | "type" | "priority";

export function useGoals() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [filters, setFiltersState] = useState<GoalFilters>(defaultFilters);
  const [sort, setSortState] = useState<GoalSortOption>(defaultSort);
  const [grouping, setGrouping] = useState<GroupingMode>("none");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedFilters = window.localStorage.getItem(FILTER_STORAGE_KEY);
      if (storedFilters) {
        setFiltersState({ ...defaultFilters, ...JSON.parse(storedFilters) });
      }
      const storedSort = window.localStorage.getItem(SORT_STORAGE_KEY);
      if (storedSort) {
        setSortState(storedSort as GoalSortOption);
      }
      const storedGrouping = window.localStorage.getItem(GROUPING_STORAGE_KEY);
      if (storedGrouping === "type" || storedGrouping === "priority") {
        setGrouping(storedGrouping);
      }
    } catch (error) {
      console.warn("Failed to load goal preferences", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SORT_STORAGE_KEY, sort);
  }, [sort]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(GROUPING_STORAGE_KEY, grouping);
  }, [grouping]);

  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: () => api<Goal[]>("/api/goals"),
  });

  const { data: suggestion } = useQuery<AutomationSuggestion | null>({
    queryKey: ["goals", "suggestion"],
    queryFn: () => api<AutomationSuggestion | null>("/api/goals/suggestions"),
    staleTime: 60_000,
  });

  const { data: fundingAccounts = [] } = useQuery<FundingAccount[]>({
    queryKey: ["goals", "funding-accounts"],
    queryFn: () => api<FundingAccount[]>("/api/goals/funding-accounts"),
    staleTime: 5 * 60_000,
  });

  const createGoalMutation = useMutation({
    mutationFn: (payload: Partial<Goal>) => api<Goal>("/api/goals", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: goal => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Goal created",
        description: `“${goal.name}” added to your mission grid.`,
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ goalId, payload }: { goalId: string; payload: Partial<Goal> }) =>
      api<Goal>(`/api/goals/${goalId}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: goal => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Goal updated",
        description: `Latest plan saved for “${goal.name}”.`,
      });
    },
  });

  const fundGoalMutation = useMutation({
    mutationFn: ({ goalId, amount, sourceAccountId, note, date }: { goalId: string; amount: number; sourceAccountId: string; note?: string; date?: string }) =>
      api<Goal>(`/api/goals/${goalId}/fund`, {
        method: "POST",
        body: JSON.stringify({ amount, sourceAccountId, note, date }),
      }),
    onSuccess: goal => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Contribution recorded",
        description: `Progress updated for “${goal.name}”.`,
      });
    },
  });

  const autoFundMutation = useMutation({
    mutationFn: ({ goalId, payload }: { goalId: string; payload: { sourceAccountId: string; frequency: "weekly" | "biweekly" | "monthly"; amount: number; untilTarget?: boolean; untilDate?: string } }) =>
      api<{ automationId: string }>(`/api/goals/${goalId}/auto-fund`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Auto-funding enabled",
        description: "Recurring transfer scheduled."
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (goalId: string) => api<{ status: string }>(`/api/goals/${goalId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Goal archived",
        description: "Goal moved to archive."
      });
    },
  });

  const runSimulationMutation = useMutation({
    mutationFn: ({ goalId, input }: { goalId: string; input: SimulationInput }) =>
      api<SimulationResult>(`/api/goals/${goalId}/simulate`, { method: "POST", body: JSON.stringify(input) }),
  });

  const runSimulation = useCallback(
    (goalId: string, input: SimulationInput) => runSimulationMutation.mutateAsync({ goalId, input }),
    [runSimulationMutation],
  );

  const setFilters = useCallback((updater: (prev: GoalFilters) => GoalFilters) => {
    setFiltersState(prev => updater(prev));
  }, []);

  const setSort = useCallback((value: GoalSortOption) => {
    setSortState(value);
  }, []);

  const toggleGrouping = useCallback(() => {
    setGrouping(prev => {
      if (prev === "none") return "type";
      if (prev === "type") return "priority";
      return "none";
    });
  }, []);

  const analytics: GoalAnalyticsSnapshot = useMemo(() => {
    const active = goals.filter(goal => !goal.archived && goal.status !== "archived");
    const totalGoals = goals.length;
    const activeGoals = active.length;
    const totalSaved = active.reduce((sum, goal) => sum + goal.current, 0);
    const totalTarget = active.reduce((sum, goal) => sum + goal.target, 0);
    const averageProgress = active.length
      ? active.reduce((sum, goal) => sum + Math.min(100, (goal.target > 0 ? (goal.current / goal.target) * 100 : 0)), 0) / active.length
      : 0;
    const completionRate = active.length
      ? (active.filter(goal => goal.current >= goal.target).length / active.length) * 100
      : 0;
    const deadlines = active
      .map(goal => new Date(goal.deadline ?? goal.updatedAt))
      .filter(date => !Number.isNaN(date.getTime()) && date.getTime() >= Date.now())
      .sort((a, b) => a.getTime() - b.getTime());
    return {
      totalGoals,
      activeGoals,
      totalSaved,
      totalTarget,
      averageProgress,
      completionRate,
      closestDeadline: deadlines[0]?.toISOString(),
    };
  }, [goals]);

  const filteredGoals = useMemo(() => {
    const list = goals.filter(goal => {
      if (filters.status !== "all") {
        if (filters.status === "completed" && goal.current < goal.target) return false;
        if (filters.status === "active" && (goal.current >= goal.target || goal.archived)) return false;
        if (filters.status === "archived" && !(goal.archived || goal.status === "archived")) return false;
      }
      if (filters.types.length && !filters.types.includes(goal.type)) return false;
      if (filters.priorities.length && !filters.priorities.includes(goal.priority)) return false;
      return true;
    });

    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "progress-desc":
          return (b.current / Math.max(1, b.target)) - (a.current / Math.max(1, a.target));
        case "progress-asc":
          return (a.current / Math.max(1, a.target)) - (b.current / Math.max(1, b.target));
        case "amount-left":
          return (a.target - a.current) - (b.target - b.current);
        case "deadline":
        default: {
          const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
          const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
          return dateA - dateB;
        }
      }
    });

    return sorted;
  }, [filters, goals, sort]);

  const groupedGoals = useMemo(() => {
    if (grouping === "none") {
      return { all: filteredGoals } as Record<string, Goal[]>;
    }
    const map = new Map<string, Goal[]>();
    filteredGoals.forEach(goal => {
      const key = grouping === "type" ? goal.type : goal.priority;
      const bucket = map.get(key) ?? [];
      bucket.push(goal);
      map.set(key, bucket);
    });
    return Object.fromEntries(map);
  }, [filteredGoals, grouping]);

  const resetSuggestion = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["goals", "suggestion"] });
  }, [queryClient]);

  return {
    goals,
    filteredGoals,
    groupedGoals,
    analytics,
    filters,
    setFilters,
    sort,
    setSort,
    grouping,
    toggleGrouping,
    isLoading,
    createGoal: createGoalMutation.mutateAsync,
    updateGoal: updateGoalMutation.mutateAsync,
    fundGoal: fundGoalMutation.mutateAsync,
    deleteGoal: deleteGoalMutation.mutateAsync,
    setAutoFundRule: autoFundMutation.mutateAsync,
    runSimulation,
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
    isFunding: fundGoalMutation.isPending,
    isAutomating: autoFundMutation.isPending,
    fundingAccounts,
    suggestion: suggestion ?? null,
    resetSuggestion,
  };
}
