import { z } from "zod";

export const idSchema = z.string().min(1, "id required");

export const timestampSchema = z.union([
  z.string(),
  z.date(),
]);

const currencySchema = z.object({
  amount: z.number(),
  currency: z.string().default("USD"),
});

export const transactionSchema = z.object({
  id: idSchema,
  accountId: idSchema,
  postedAt: timestampSchema,
  description: z.string(),
  amount: z.number(),
  category: z.string(),
  status: z.enum(["cleared", "pending", "split"]),
  linkedDocuments: z.array(idSchema).default([]),
});

export const billSchema = z.object({
  id: idSchema,
  name: z.string(),
  dueDate: timestampSchema,
  amount: currencySchema,
  status: z.enum(["due", "paid", "overdue"]),
  autopay: z.boolean().default(false),
  accountId: idSchema.optional(),
});

export const budgetPeriodSchema = z.object({
  id: idSchema,
  name: z.string(),
  start: timestampSchema,
  end: timestampSchema,
  planned: z.number(),
  actual: z.number(),
});

export const goalSchema = z.object({
  id: idSchema,
  name: z.string(),
  targetAmount: z.number(),
  currentAmount: z.number(),
  eta: timestampSchema.optional(),
});

export const accountSchema = z.object({
  id: idSchema,
  name: z.string(),
  type: z.enum(["cash", "credit", "investment", "loan"]),
  balance: z.number(),
});

export const documentSchema = z.object({
  id: idSchema,
  name: z.string(),
  kind: z.enum(["invoice", "receipt", "id", "medical", "other"]).default("other"),
  uploadedAt: timestampSchema,
  sizeKb: z.number().nonnegative(),
});

export const eventSchema = z.object({
  id: idSchema,
  title: z.string(),
  startsAt: timestampSchema,
  endsAt: timestampSchema.optional(),
  location: z.string().optional(),
  category: z.string().optional(),
});

export const routineSchema = z.object({
  id: idSchema,
  name: z.string(),
  cadence: z.string(),
  nextOccurrence: timestampSchema,
});

export const careProfileSchema = z.object({
  id: idSchema,
  name: z.string(),
  relationship: z.string(),
});

export const medicationSchema = z.object({
  id: idSchema,
  name: z.string(),
  dosage: z.string(),
  schedule: z.array(
    z.object({
      time: z.string(),
      quantity: z.number(),
    })
  ),
});

export const doseSchema = z.object({
  id: idSchema,
  medicationId: idSchema,
  scheduledAt: timestampSchema,
  takenAt: timestampSchema.optional(),
  status: z.enum(["scheduled", "taken", "missed"]),
});

export const refillSchema = z.object({
  id: idSchema,
  medicationId: idSchema,
  requestedAt: timestampSchema,
  status: z.enum(["pending", "submitted", "ready", "picked_up"]),
});

export const assetSchema = z.object({
  id: idSchema,
  name: z.string(),
  kind: z.enum(["stock", "bond", "crypto", "cash", "other"]),
  value: currencySchema,
  change24h: z.number().optional(),
});

export const meterSchema = z.object({
  id: idSchema,
  name: z.string(),
  value: z.number(),
  unit: z.string(),
  updatedAt: timestampSchema,
});

export const nudgeSchema = z.object({
  id: idSchema,
  title: z.string(),
  message: z.string(),
  channel: z.enum(["sms", "email", "push", "whatsapp"]),
  scheduledFor: timestampSchema.optional(),
});

export const playSchema = z.object({
  id: idSchema,
  team: z.string(),
  opponent: z.string(),
  line: z.number(),
  impliedProb: z.number(),
  kickoff: timestampSchema,
});

export const edgeSchema = z.object({
  id: idSchema,
  fromId: idSchema,
  toId: idSchema,
  role: z.string(),
  confidence: z.number().min(0).max(1).default(0.5),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type Bill = z.infer<typeof billSchema>;
export type BudgetPeriod = z.infer<typeof budgetPeriodSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type Account = z.infer<typeof accountSchema>;
export type Document = z.infer<typeof documentSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Routine = z.infer<typeof routineSchema>;
export type CareProfile = z.infer<typeof careProfileSchema>;
export type Medication = z.infer<typeof medicationSchema>;
export type Dose = z.infer<typeof doseSchema>;
export type Refill = z.infer<typeof refillSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type Meter = z.infer<typeof meterSchema>;
export type Nudge = z.infer<typeof nudgeSchema>;
export type Play = z.infer<typeof playSchema>;
export type Edge = z.infer<typeof edgeSchema>;

export const overviewSchema = z.object({
  netWorth: z.number(),
  cashOnHand: z.object({
    amount: z.number(),
    runwayDays: z.number(),
  }),
  nextBills: z.object({
    count: z.number(),
    total: z.number(),
    soonest: z.string(),
  }),
  monthlyBurn: z.object({
    actual: z.number(),
    target: z.number(),
  }),
  savingsProgress: z.object({
    percent: z.number(),
    delta: z.number(),
  }),
  adherence: z.object({
    percent30d: z.number(),
    onHandDays: z.number().optional(),
  }),
  goals: z.object({
    top: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        percent: z.number(),
        eta: z.string().optional(),
      })
    ),
  }),
  pulse: z.object({
    games: z.number(),
    bestValueScore: z.number(),
  }),
});

export type Overview = z.infer<typeof overviewSchema>;

export const queueItemSchema = z.object({
  id: z.string(),
  kind: z.union([
    z.literal("bill"),
    z.literal("budgetVariance"),
    z.literal("txnDuplicate"),
    z.literal("refill"),
    z.literal("doseOverdue"),
    z.literal("docExpiry"),
    z.literal("rentLedger"),
    z.literal("goalUnderfunded"),
    z.literal("maintenance"),
    z.literal("valuePlay"),
    z.literal("weatherAlert"),
  ]),
  title: z.string(),
  detail: z.string(),
  priorityScore: z.number().min(0).max(100),
  impact: z
    .object({
      runwayDelta: z.number().optional(),
      burnDelta: z.number().optional(),
      goalEtaDeltaDays: z.number().optional(),
      adherenceDelta: z.number().optional(),
    })
    .optional(),
  links: z
    .array(
      z.object({
        entityId: z.string(),
        entityType: z.string(),
      })
    )
    .optional(),
  actions: z.array(
    z.union([
      z.literal("Accept"),
      z.literal("Schedule"),
      z.literal("Nudge"),
      z.literal("Simulate"),
      z.literal("Explain"),
      z.literal("Open"),
      z.literal("Ignore"),
    ])
  ),
  category: z
    .union([
      z.literal("finance"),
      z.literal("care"),
      z.literal("home"),
      z.literal("goals"),
      z.literal("pulse"),
    ])
    .default("finance"),
});

export type QueueItem = z.infer<typeof queueItemSchema>;

export const impactPlanSchema = z.object({
  warnings: z.array(z.string()),
  derivedWrites: z.array(
    z.object({
      collection: z.string(),
      id: z.string(),
      change: z.enum(["create", "update", "delete"]),
      diff: z.record(z.any()),
    })
  ),
  automations: z.array(
    z.object({
      ruleId: z.string(),
      action: z.string(),
      params: z.record(z.any()).optional(),
    })
  ),
  aggregatesToRecompute: z.array(z.string()),
  kpiDelta: z
    .object({
      runwayDays: z.number().optional(),
      burnDelta: z.number().optional(),
      adherence: z.number().optional(),
      goalEtaDeltaDays: z.number().optional(),
    })
    .optional(),
});

export type ImpactPlan = z.infer<typeof impactPlanSchema>;

export const commandSchema = z.object({
  type: z.union([
    z.literal("txn.reclassify.bulk"),
    z.literal("bill.markPaid"),
    z.literal("goal.allocate"),
    z.literal("doc.link"),
    z.literal("event.create"),
    z.literal("dose.log"),
    z.literal("refill.request"),
    z.literal("rule.create"),
    z.literal("play.track"),
  ]),
  payload: z.record(z.any()),
  idempotencyKey: z.string(),
  signedImpactPlan: impactPlanSchema.optional(),
});

export type Command = z.infer<typeof commandSchema>;

export type TimelineEntry = {
  id: string;
  date: string;
  label: string;
  detail: string;
  status: "scheduled" | "completed" | "atRisk";
};

export type CashflowInsight = {
  id: string;
  postedAt: string;
  amount: number;
  category: string;
  status: "cleared" | "pending" | "forecast";
  memo?: string;
};

export type DocSummary = {
  id: string;
  name: string;
  kind: string;
  uploadedAt: string;
  link?: string;
};

export type PersonSummary = {
  id: string;
  name: string;
  role: string;
  reachableVia: string[];
  preferredChannel?: string;
};

export type RuleSummary = {
  id: string;
  name: string;
  status: "enabled" | "disabled";
  description: string;
  lastRunAt?: string;
  hitCount: number;
};

export type ScenarioPreview = {
  id: string;
  title: string;
  description: string;
  runwayDelta?: number;
  burnDelta?: number;
  goalEtaDeltaDays?: number;
};

export type CanvasContext = {
  summary: {
    title: string;
    subtitle: string;
    impact?: ImpactPlan["kpiDelta"];
  };
  timeline: TimelineEntry[];
  cashflow: {
    variance: number;
    burnRate: number;
    transactions: CashflowInsight[];
  };
  docs: DocSummary[];
  people: PersonSummary[];
  rules: RuleSummary[];
  scenarios: ScenarioPreview[];
  explain: string[];
};

