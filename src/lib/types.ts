
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

export type MedicationRegimen = {
  name: string;
  dosage: string;
  timing: string;
  tabsNeeded: number;
  tabsTaken: number;
  tabletsRemaining: number;
  refillDate: string;
  notes?: string;
};

export type DoctorAppointment = {
  provider: string;
  focus: string;
  date: string;
  location: string;
  preparation?: string;
};

export type MarketAsset = {
  symbol: string;
  name: string;
  type: "stock" | "crypto";
  price: number;
  change: number;
  changePercent: number;
  allocation: number;
  currency?: string;
};
