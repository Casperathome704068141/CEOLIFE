import type {
  ScheduleEvent,
  CashflowData,
  BriefingInsight,
  TrendPoint,
} from "@/lib/types";

export const netWorth = 186_430.25;

export const statHighlights = [
  {
    title: "Net worth",
    value: new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(netWorth),
    delta: "+$4.3K vs last month",
    trend: "up" as const,
  },
  {
    title: "Cash on hand",
    value: "$42,870",
    delta: "Burn runway 7.5 months",
    trend: "neutral" as const,
  },
  {
    title: "Next bills",
    value: "$1,945",
    delta: "3 due within 5 days",
    trend: "down" as const,
  },
  {
    title: "Monthly burn",
    value: "$4,820",
    delta: "+8% vs target",
    trend: "down" as const,
  },
  {
    title: "Savings progress",
    value: "68%",
    delta: "+$1,200 allocated this week",
    trend: "up" as const,
  },
];

export const schedule: ScheduleEvent[] = [
  { time: "07:30", title: "Morning briefing", description: "Review priorities with Beno" },
  { time: "09:00", title: "Ops sync", description: "Finance + household status" },
  { time: "13:00", title: "Lunch with Leo", description: "Discuss shared budget" },
  { time: "18:30", title: "Gym & wellness", description: "Strength routine" },
];

export const cashflowData: CashflowData[] = [
  { month: "May", income: 12_200, expenses: 7_200 },
  { month: "Jun", income: 12_600, expenses: 7_450 },
  { month: "Jul", income: 12_400, expenses: 8_020 },
  { month: "Aug", income: 12_900, expenses: 7_980 },
  { month: "Sep", income: 13_200, expenses: 8_150 },
  { month: "Oct", income: 13_400, expenses: 8_320 },
];

export const sparklineData: TrendPoint[] = [
  { label: "Mon", value: 620 },
  { label: "Tue", value: 580 },
  { label: "Wed", value: 690 },
  { label: "Thu", value: 640 },
  { label: "Fri", value: 720 },
  { label: "Sat", value: 680 },
  { label: "Sun", value: 540 },
];

export const briefingInsights: BriefingInsight[] = [
  {
    id: "cashflow",
    title: "Cashflow risk next Thursday",
    detail: "Utilities + rent hit before paycheque. Projected balance dips to $1,240. Suggest moving $600 from savings buffer or nudging Marcus for transfer receipt.",
  },
  {
    id: "bill",
    title: "Credit card autopay spike",
    detail: "$820 statement includes two flagged travel charges. Consider splitting and tagging reimbursables; nudge brothers to confirm.",
  },
  {
    id: "goal",
    title: "Goal ahead of plan",
    detail: "Japan expedition is 3 weeks ahead. Reallocate $400 to emergency fund and set automation for payday sweep.",
  },
];

export const vaultInboxHints = [
  {
    id: "receipts",
    title: "Parse all receipts",
    description: "5 new uploads ready for OCR and categorization. Review flagged matches after processing.",
  },
  {
    id: "ids",
    title: "ID expiry checks",
    description: "Two passports expire within 18 months — schedule renewal routine.",
  },
  {
    id: "nudges",
    title: "Queue nudges",
    description: "Send WhatsApp reminder for Marcus’ utility split before quiet hours.",
  },
];
