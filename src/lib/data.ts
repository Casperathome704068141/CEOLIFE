import type {
  Bill,
  ScheduleEvent,
  CashflowData,
  SavingsGoal,
  DocumentItem,
  ShoppingItem,
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

export const bills: Bill[] = [
  { name: "Rent", amount: 2_350, dueDate: "Nov 1", icon: "Home" },
  { name: "Credit Card", amount: 820.45, dueDate: "Oct 28", icon: "CreditCard" },
  { name: "Internet", amount: 89.99, dueDate: "Oct 30", icon: "Wifi" },
  { name: "Utilities", amount: 145.5, dueDate: "Nov 3", icon: "Droplets" },
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

export const savingsGoals: SavingsGoal[] = [
  {
    name: "Japan expedition",
    target: 12_000,
    current: 7_850,
    description: "Immersive spring 2025 trip",
    deadline: "Mar 2025",
    priority: "high",
  },
  {
    name: "Emergency fund",
    target: 18_000,
    current: 12_200,
    description: "6 months runway",
    deadline: "Dec 2024",
    priority: "medium",
  },
  {
    name: "Home tech refresh",
    target: 6_500,
    current: 3_050,
    description: "Appliances + workspace",
    deadline: "Jun 2025",
    priority: "low",
  },
];

export const documents: DocumentItem[] = [
  { name: "Passport - Beno.pdf", type: "ID", date: "2023-09-12", icon: "Plane", tags: ["expires 2028", "travel"] },
  { name: "Lease - Harborfront Loft.pdf", type: "Housing", date: "2024-08-01", icon: "Home", tags: ["rent", "shared"] },
  { name: "Insurance policy #9821.pdf", type: "Insurance", date: "2024-04-20", icon: "ShieldCheck", tags: ["auto", "renewal"] },
  { name: "Consulting retainer.pdf", type: "Income", date: "2024-09-15", icon: "Briefcase", tags: ["cashflow"] },
];

export const shoppingList: ShoppingItem[] = [
  { id: 1, name: "Steel-cut oats", checked: false, owner: "House" },
  { id: 2, name: "Cold brew beans", checked: true, owner: "Beno" },
  { id: 3, name: "Air filters", checked: false, owner: "Shared" },
  { id: 4, name: "Cleaning tablets", checked: false, owner: "House" },
];

export const briefingInsights: BriefingInsight[] = [
  {
    id: "cashflow",
    title: "Cashflow risk next Thursday",
    detail: "Utilities + rent hit before paycheque. Projected balance dips to $1,240. Suggest moving $600 from savings buffer.",
  },
  {
    id: "bill",
    title: "Credit card autopay spike",
    detail: "$820 statement includes two flagged travel charges. Consider splitting and tagging reimbursables.",
  },
  {
    id: "goal",
    title: "Goal ahead of plan",
    detail: "Japan expedition is 3 weeks ahead. Reallocate $400 to emergency fund to stay on track.",
  },
];

export const vaultInboxHints = [
  {
    id: "receipts",
    title: "Parse all receipts",
    description: "5 new uploads ready for OCR and categorization.",
  },
  {
    id: "ids",
    title: "ID expiry checks",
    description: "Two passports expire within 18 months.",
  },
];
