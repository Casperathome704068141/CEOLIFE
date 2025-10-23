import type {
  ScheduleEvent,
  CashflowData,
  BriefingInsight,
  TrendPoint,
  MedicationRegimen,
  DoctorAppointment,
  MarketAsset,
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

export const medicationRegimen: MedicationRegimen[] = [
  {
    name: "Hydroxyurea",
    dosage: "500 mg",
    timing: "07:30 – with breakfast",
    tabsNeeded: 2,
    tabsTaken: 2,
    tabletsRemaining: 18,
    refillDate: "2024-01-17",
    notes: "Log any side effects and hydrate before dose.",
  },
  {
    name: "Folic acid",
    dosage: "1 mg",
    timing: "21:00 – after dinner",
    tabsNeeded: 1,
    tabsTaken: 0,
    tabletsRemaining: 22,
    refillDate: "2024-01-24",
    notes: "Set reminder if evening routines shift.",
  },
  {
    name: "Ibuprofen",
    dosage: "400 mg",
    timing: "As needed – pain episodes",
    tabsNeeded: 1,
    tabsTaken: 1,
    tabletsRemaining: 8,
    refillDate: "2023-12-10",
    notes: "Track pain intensity in wellness journal.",
  },
];

export const careTeamAppointments: DoctorAppointment[] = [
  {
    provider: "Dr. Ama Mensah",
    focus: "Hematology follow-up",
    date: "2024-01-21T09:30:00",
    location: "Korle Bu Teaching Hospital – Clinic 3",
    preparation: "Bring medication log and latest lab results.",
  },
  {
    provider: "Nurse Kofi Owusu",
    focus: "Pain management check-in",
    date: "2024-01-28T15:00:00",
    location: "Virtual session",
    preparation: "Share pain episode tracker with notes.",
  },
];

export const marketWatchlist: MarketAsset[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    price: 176.43,
    change: 1.62,
    changePercent: 0.93,
    allocation: 0.24,
    currency: "USD",
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    type: "stock",
    price: 328.12,
    change: -2.47,
    changePercent: -0.75,
    allocation: 0.19,
    currency: "USD",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Class A",
    type: "stock",
    price: 132.58,
    change: 0.84,
    changePercent: 0.64,
    allocation: 0.12,
    currency: "USD",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    type: "crypto",
    price: 34980,
    change: 245,
    changePercent: 0.71,
    allocation: 0.27,
    currency: "USD",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    type: "crypto",
    price: 1875,
    change: -18,
    changePercent: -0.95,
    allocation: 0.11,
    currency: "USD",
  },
];
