import type { LucideIcon } from 'lucide-react';

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

export type BriefingInsight = {
  id: string;
  title: string;
  detail: string;
};

export type TrendPoint = {
  label: string;
  value: number;
};
