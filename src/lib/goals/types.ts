export type GoalType = "financial" | "household" | "education" | "travel" | "health" | "other";
export type GoalPriority = "high" | "medium" | "low";
export type GoalStatus = "active" | "completed" | "archived";

export interface GoalLinkedEntity {
  type: "bill" | "asset" | "medication" | "habit";
  id: string;
  label?: string;
}

export type GoalTimestamp = string | number | Date;

export interface AutoFundRule {
  sourceAccountId: string;
  frequency: "weekly" | "biweekly" | "monthly";
  amount: number;
  untilTarget?: boolean;
  untilDate?: string;
}

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  target: number;
  current: number;
  currency?: string;
  deadline?: GoalTimestamp;
  priority: GoalPriority;
  linkedAccount?: string;
  linkedEntity?: GoalLinkedEntity;
  autoFundRule?: AutoFundRule;
  color?: string;
  notes?: string;
  status?: GoalStatus;
  archived?: boolean;
  createdAt: GoalTimestamp;
  updatedAt: GoalTimestamp;
}

export interface GoalFilters {
  types: GoalType[];
  priorities: GoalPriority[];
  status: GoalStatus | "all";
}

export type GoalSortOption = "deadline" | "progress-desc" | "progress-asc" | "amount-left";

export interface GoalAnalyticsSnapshot {
  totalGoals: number;
  activeGoals: number;
  averageProgress: number;
  totalSaved: number;
  totalTarget: number;
  closestDeadline?: string;
  completionRate: number;
}

export interface AutomationSuggestion {
  id: string;
  headline: string;
  detail: string;
  recommendedIncrease?: number;
  goalId?: string;
  cta: {
    applyLabel: string;
    simulateLabel: string;
  };
}

export interface SimulationInput {
  weeklyContribution: number;
  incomeChangePct: number;
}

export interface SimulationPoint {
  monthLabel: string;
  contribution: number;
  projectedTotal: number;
}

export interface SimulationResult {
  points: SimulationPoint[];
  monthsToTarget: number;
  reachDate: string;
}

export interface FundingAccount {
  id: string;
  name: string;
  balance: number;
  institution: string;
  type: "checking" | "savings" | "investment";
  currency: string;
}
