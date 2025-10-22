import type { LucideIcon } from "lucide-react";

export type Bill = {
  name: string;
  amount: number;
  dueDate: string;
  icon: LucideIcon;
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
};

export type Document = {
  name: string;
  type: string;
  date: string;
  icon: LucideIcon;
};

export type ShoppingItem = {
  id: number;
  name: string;
  checked: boolean;
};
