import { NextResponse } from "next/server";
import { ScenarioParameters, ScenarioPreset } from "@/lib/sim/types";

const presets: Array<{ id: string; name: string; preset: ScenarioPreset; params: ScenarioParameters }> = [
  {
    id: "income-up",
    name: "Income increase",
    preset: "income-change",
    params: { horizonMonths: 18, incomeDeltaPct: 8 },
  },
  {
    id: "income-down",
    name: "Income reduction",
    preset: "income-change",
    params: { horizonMonths: 12, incomeDeltaPct: -12 },
  },
  {
    id: "travel-euro",
    name: "European sabbatical",
    preset: "travel",
    params: { horizonMonths: 12, travelBudget: 4500, travelRecurring: "one-off" },
  },
  {
    id: "housing-move",
    name: "Move to downtown loft",
    preset: "housing",
    params: { horizonMonths: 24, rentDeltaPct: 18 },
  },
  {
    id: "education-grad",
    name: "Graduate program",
    preset: "education",
    params: { horizonMonths: 24, discretionaryDeltaPct: -5, travelBudget: 1200, travelRecurring: "monthly" },
  },
  {
    id: "debt-avalanche",
    name: "Debt avalanche focus",
    preset: "debt-payoff",
    params: { horizonMonths: 18, debtPayExtra: 450 },
  },
];

export async function GET() {
  return NextResponse.json({ presets });
}
