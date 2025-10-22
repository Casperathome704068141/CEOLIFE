import type { LucideIcon } from "lucide-react";

export type Bill = {
  name: string;
  amount: number;
  dueDate: string;
  icon: string;
};

export type ScheduleEvent = {
  time: string;
  title: string;
  description: string;
};

export type CashflowData = {
  month: string;
  income: number;
  expenses: number;
};

export type SavingsGoal = {
  name: string;
  target: number;
  current: number;
  description: string;
  deadline: string;
  priority: "high" | "medium" | "low";
};

export type DocumentItem = {
  name: string;
  type: string;
  date: string;
  icon: string;
  tags?: string[];
};

export type ShoppingItem = {
  id: number;
  name: string;
  checked: boolean;
  owner?: string;
};

export type BriefingInsight = {
  id: string;
  title: string;
  detail: string;
};

export type TrendPoint = {
  label: string;
  value: number;
};
