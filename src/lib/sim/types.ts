export type ScenarioPreset = "income-change" | "travel" | "housing" | "education" | "debt-payoff" | "custom";

export type ShockEventType = "unexpected-expense" | "job-loss" | "bonus";

export interface ShockEvent {
  monthOffset: number;
  type: ShockEventType;
  amount: number;
}

export interface ScenarioParameters {
  incomeDeltaPct?: number;
  rentDeltaPct?: number;
  travelBudget?: number;
  travelRecurring?: "one-off" | "monthly";
  discretionaryDeltaPct?: number;
  debtPayExtra?: number;
  startDate?: string; // ISO
  horizonMonths: number; // 6..36
}

export interface ScenarioAssumptions {
  inflationPct?: number;
  returnPct?: number;
  interestRatesPct?: number;
  savingsRatePct?: number;
}

export interface SimResultPoint {
  date: string;
  balance: number;
  income: number;
  expenses: number;
  goalProgress: number;
}

export interface SimResultGoalEta {
  goalId: string;
  eta: string;
}

export interface SimResult {
  monthly: SimResultPoint[];
  runwayMonths: number;
  breakEvenDate?: string;
  goalEtas?: SimResultGoalEta[];
  riskScore: number; // 0..100
}

export interface Scenario {
  id: string;
  name: string;
  preset?: ScenarioPreset;
  params: ScenarioParameters;
  shocks?: ShockEvent[];
  assumptions: ScenarioAssumptions;
  results?: SimResult;
  createdAt: number;
  updatedAt: number;
}

export interface RunSimulationInput {
  params: ScenarioParameters;
  shocks?: ShockEvent[];
  assumptions?: ScenarioAssumptions;
  baselineDate?: string;
}

export interface MonteCarloVolatility {
  incomePct: number;
  expensePct: number;
}

export interface MonteCarloRequest extends RunSimulationInput {
  trials: number;
  volatility: MonteCarloVolatility;
  seed?: number;
}

export interface MonteCarloPercentilePoint {
  date: string;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

export interface MonteCarloHistogramBin {
  bucket: number;
  count: number;
}

export interface MonteCarloResult {
  percentiles: MonteCarloPercentilePoint[];
  histogram: MonteCarloHistogramBin[];
  deficitProbability: number;
}

export interface PlanChangeSummary {
  budgets: Array<{ category: string; delta: number }>;
  automationRules: Array<{ id: string; description: string; enabled: boolean }>;
  debtSchedule: Array<{ month: string; amount: number }>;
}
