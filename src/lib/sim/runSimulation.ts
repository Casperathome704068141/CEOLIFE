import { addMonths } from "date-fns";
import {
  MonteCarloVolatility,
  RunSimulationInput,
  ScenarioParameters,
  ScenarioAssumptions,
  ShockEvent,
  SimResult,
  SimResultPoint,
} from "./types";

const BASE_INCOME = 6800;
const BASE_EXPENSES = 5200;
const BASE_DISCRETIONARY = 1400;
const BASE_RENT = 1900;
const BASE_BALANCE = 12000;

function applyShock(value: number, shock: ShockEvent): number {
  switch (shock.type) {
    case "bonus":
      return value + shock.amount;
    case "job-loss":
      return value - Math.abs(shock.amount);
    case "unexpected-expense":
      return value - Math.abs(shock.amount);
    default:
      return value;
  }
}

function projectIncome(params: ScenarioParameters): number {
  const delta = (params.incomeDeltaPct ?? 0) / 100;
  return BASE_INCOME * (1 + delta);
}

function projectExpenses(params: ScenarioParameters): number {
  const discretionaryDelta = (params.discretionaryDeltaPct ?? 0) / 100;
  const rentDelta = (params.rentDeltaPct ?? 0) / 100;
  const discretionary = BASE_DISCRETIONARY * (1 + discretionaryDelta);
  const rent = BASE_RENT * (1 + rentDelta);
  const other = Math.max(BASE_EXPENSES - BASE_DISCRETIONARY - BASE_RENT, 0);
  let expenses = discretionary + rent + other;
  if (params.travelBudget) {
    if (params.travelRecurring === "monthly") {
      expenses += params.travelBudget;
    }
  }
  if (params.debtPayExtra) {
    expenses += params.debtPayExtra;
  }
  return expenses;
}

function computeRiskScore(points: SimResultPoint[]): number {
  if (!points.length) return 0;
  const net = points.map((point) => point.income - point.expenses);
  const avg = net.reduce((sum, value) => sum + value, 0) / net.length;
  const variance =
    net.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / Math.max(net.length - 1, 1);
  const volatility = Math.sqrt(variance);
  const lastBalance = points[points.length - 1]?.balance ?? 0;
  const runwayPenalty = points.findIndex((point) => point.balance < 0);
  const normalizedVol = Math.min(volatility / 5000, 1);
  const deficitPenalty = runwayPenalty === -1 ? 0 : Math.max(1 - runwayPenalty / points.length, 0.2);
  const safetyBoost = lastBalance > 0 ? Math.min(lastBalance / 20000, 0.4) : -0.3;
  const raw = 1 - normalizedVol - deficitPenalty + safetyBoost;
  return Math.min(Math.max(Math.round(raw * 100), 0), 100);
}

function applyInflation(expenses: number, monthIndex: number, assumptions?: ScenarioAssumptions): number {
  const inflation = (assumptions?.inflationPct ?? 3) / 100;
  if (!inflation) return expenses;
  const monthlyRate = inflation / 12;
  return expenses * Math.pow(1 + monthlyRate, monthIndex);
}

function applyReturns(balance: number, assumptions?: ScenarioAssumptions): number {
  const returns = (assumptions?.returnPct ?? 2) / 100;
  if (!returns) return balance;
  const monthlyRate = returns / 12;
  return balance * (1 + monthlyRate);
}

function buildGoalEtas(points: SimResultPoint[], assumptions?: ScenarioAssumptions) {
  const etas = [] as SimResult["goalEtas"];
  if (!points.length) return etas;
  const savingsRate = (assumptions?.savingsRatePct ?? 12) / 100;
  const targetGoals = ["emergency", "education", "travel"];
  for (let index = 0; index < targetGoals.length; index++) {
    const goalId = targetGoals[index];
    const targetAmount = 5000 + index * 2500;
    let cumulative = 0;
    for (const point of points) {
      cumulative += Math.max(point.income - point.expenses, 0) * savingsRate;
      if (cumulative >= targetAmount) {
        etas?.push({ goalId, eta: point.date });
        break;
      }
    }
  }
  return etas;
}

export function runSimulation(input: RunSimulationInput): SimResult {
  const {
    params,
    shocks = [],
    assumptions,
    baselineDate = new Date().toISOString(),
  } = input;

  const horizon = Math.min(Math.max(params.horizonMonths ?? 12, 6), 60);
  const startDate = params.startDate ? new Date(params.startDate) : new Date(baselineDate);

  const monthlyPoints: SimResultPoint[] = [];
  let balance = BASE_BALANCE;
  let runwayMonths = horizon;
  let deficitRecorded = false;

  for (let monthIndex = 0; monthIndex < horizon; monthIndex++) {
    let income = projectIncome(params);
    let expenses = projectExpenses(params);

    income = applyInflation(income, monthIndex, assumptions);
    expenses = applyInflation(expenses, monthIndex, assumptions);

    const monthShocks = shocks.filter((shock) => shock.monthOffset === monthIndex);
    if (monthShocks.length) {
      for (const shock of monthShocks) {
        if (shock.type === "bonus") {
          income = applyShock(income, shock);
        } else {
          expenses = applyShock(expenses, shock);
        }
      }
    }

    if (params.travelBudget && params.travelRecurring !== "monthly" && monthIndex === 0) {
      expenses += params.travelBudget;
    }

    const nextBalance = applyReturns(balance, assumptions) + income - expenses;

    balance = nextBalance;

    if (!deficitRecorded && balance < 0) {
      runwayMonths = monthIndex;
      deficitRecorded = true;
    }

    const monthDate = addMonths(startDate, monthIndex);

    monthlyPoints.push({
      date: monthDate.toISOString(),
      balance,
      income,
      expenses,
      goalProgress: Math.max(Math.min((balance - 5000) / 15000, 1), 0),
    });
  }

  const firstPositiveIndex = monthlyPoints.findIndex((point) => point.income - point.expenses > 0);
  const breakEvenDate = firstPositiveIndex >= 0 ? monthlyPoints[firstPositiveIndex].date : undefined;

  const goalEtas = buildGoalEtas(monthlyPoints, assumptions);

  const riskScore = computeRiskScore(monthlyPoints);

  return {
    monthly: monthlyPoints,
    runwayMonths: deficitRecorded ? runwayMonths : horizon,
    breakEvenDate,
    goalEtas,
    riskScore,
  };
}

export function projectWithNoise(
  input: RunSimulationInput,
  volatility: MonteCarloVolatility,
  random: () => number,
): SimResult {
  const noisyParams: ScenarioParameters = {
    ...input.params,
    incomeDeltaPct:
      (input.params.incomeDeltaPct ?? 0) + (random() - 0.5) * 2 * volatility.incomePct,
    discretionaryDeltaPct:
      (input.params.discretionaryDeltaPct ?? 0) + (random() - 0.5) * 2 * volatility.expensePct,
    rentDeltaPct:
      (input.params.rentDeltaPct ?? 0) + (random() - 0.5) * 2 * (volatility.expensePct / 2),
  };
  return runSimulation({
    ...input,
    params: noisyParams,
  });
}
