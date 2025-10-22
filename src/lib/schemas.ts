import { z } from "zod";

const timestampSchema = z.union([
  z.date(),
  z.object({ seconds: z.number(), nanoseconds: z.number() }),
]);

const currencySchema = z.string().length(3).toUpperCase();

const recurrenceSchema = z.object({
  frequency: z.enum(["daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"]).optional(),
  interval: z.number().int().positive().optional(),
  count: z.number().int().positive().optional(),
});

export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1),
  photoURL: z.string().url().optional(),
  roles: z.array(z.enum(["admin", "family", "guest"])).default(["admin"]),
  preferences: z
    .object({
      locale: z.string().default("en-CA"),
      currency: currencySchema.default("CAD"),
      theme: z.enum(["system", "light", "dark"]).default("dark"),
      notifications: z.record(z.boolean()).default({}),
    })
    .default({}),
  featureFlags: z.record(z.boolean()).default({}),
  onboardingState: z
    .object({
      completed: z.boolean().default(false),
      steps: z.record(z.boolean()).default({}),
    })
    .default({}),
  createdAt: timestampSchema.optional(),
  updatedAt: timestampSchema.optional(),
});

export const householdSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().optional(),
  members: z.array(z.string()),
  currency: currencySchema.default("CAD"),
  sharedSettings: z.record(z.unknown()).default({}),
  createdAt: timestampSchema.optional(),
});

export const memberSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  role: z.enum(["admin", "member", "guest"]),
  userRef: z.string().optional(),
  permissions: z.record(z.boolean()).default({}),
  createdAt: timestampSchema.optional(),
});

export const accountSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  institution: z.string(),
  mask: z.string().optional(),
  type: z.enum(["checking", "savings", "credit", "investment", "cash", "loan", "other"]),
  currentBalance: z.number(),
  currency: currencySchema.default("CAD"),
  linkedPlaidId: z.string().optional(),
  createdAt: timestampSchema.optional(),
});

export const transactionSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  householdId: z.string().optional(),
  date: timestampSchema,
  description: z.string(),
  merchant: z.string().optional(),
  amount: z.number(),
  currency: currencySchema,
  category: z.string(),
  subcategory: z.string().optional(),
  source: z.enum(["plaid", "ocr", "manual"]),
  tags: z.array(z.string()).default([]),
  attachmentRefs: z.array(z.string()).default([]),
  status: z.enum(["cleared", "pending", "flagged"]).default("pending"),
  recurrenceHint: recurrenceSchema.optional(),
  createdAt: timestampSchema.optional(),
});

export const budgetSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  period: z.string().regex(/\d{4}-\d{2}/, "expected YYYY-MM"),
  byCategory: z.record(z.number()),
  alerts: z
    .object({
      thresholds: z.array(z.number()).default([]),
    })
    .default({ thresholds: [] }),
  carryover: z.boolean().default(true),
  createdAt: timestampSchema.optional(),
});

export const debtSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  principal: z.number(),
  apr: z.number(),
  minPayment: z.number(),
  dueDay: z.number().int().min(1).max(31),
  strategy: z.enum(["snowball", "avalanche"]),
  schedule: recurrenceSchema.optional(),
  createdAt: timestampSchema.optional(),
});

export const incomeStreamSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  amount: z.number(),
  frequency: z.enum(["weekly", "biweekly", "monthly", "adhoc"]),
  nextDate: timestampSchema,
  createdAt: timestampSchema.optional(),
});

export const billSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  amount: z.number(),
  dueDate: timestampSchema,
  autopay: z.boolean().default(false),
  accountRef: z.string().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: timestampSchema.optional(),
});

export const goalSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  target: z.number(),
  current: z.number(),
  deadline: timestampSchema,
  priority: z.enum(["high", "medium", "low"]),
  linkedAccount: z.string().optional(),
  createdAt: timestampSchema.optional(),
});

export const documentSchema = z.object({
  id: z.string(),
  owner: z.string(),
  type: z.enum(["id", "contract", "bill", "insurance", "medical", "vehicle", "other"]),
  filename: z.string(),
  mime: z.string(),
  size: z.number(),
  checksum: z.string(),
  encrypted: z.literal(true),
  expireDate: timestampSchema.optional(),
  tags: z.array(z.string()).default([]),
  shareACL: z.array(z.object({ subject: z.string(), role: z.enum(["viewer", "editor", "emergency"]) })).default([]),
  createdAt: timestampSchema.optional(),
});

export const eventSchema = z.object({
  id: z.string(),
  calendarId: z.string(),
  title: z.string(),
  start: timestampSchema,
  end: timestampSchema,
  location: z.string().optional(),
  linkedEntities: z.array(z.string()).default([]),
  reminders: z.array(z.object({ minutesBefore: z.number().int() })).default([]),
  createdAt: timestampSchema.optional(),
});

export const habitSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  schedule: recurrenceSchema,
  streak: z.number().int().default(0),
  notes: z.string().optional(),
  createdAt: timestampSchema.optional(),
});

export const assetSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  category: z.enum(["appliance", "furniture", "vehicle", "electronics", "other"]),
  serial: z.string().optional(),
  purchaseDate: timestampSchema.optional(),
  warrantyEnd: timestampSchema.optional(),
  receiptDocRef: z.string().optional(),
  photos: z.array(z.string()).default([]),
  createdAt: timestampSchema.optional(),
});

export const shoppingListSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      qty: z.number().default(1),
      priority: z.enum(["low", "medium", "high"]).default("medium"),
      isRecurring: z.boolean().default(false),
      priceTarget: z.number().optional(),
    }),
  ),
  lastAutoSuggestAt: timestampSchema.optional(),
  createdAt: timestampSchema.optional(),
});

export const simulationSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  scenarioInput: z.record(z.unknown()),
  assumptions: z.record(z.unknown()).default({}),
  resultSnapshots: z.array(z.object({
    timestamp: timestampSchema,
    balance: z.number(),
    goalEta: z.string().optional(),
  })),
  createdAt: timestampSchema.optional(),
});

export const automationSchema = z.object({
  id: z.string(),
  ownerScope: z.enum(["user", "household"]),
  trigger: z.object({
    type: z.enum(["cron", "event", "threshold", "webhook"]),
    expression: z.string(),
  }),
  condition: z.record(z.unknown()).optional(),
  actions: z.array(
    z.object({
      type: z.enum(["notify", "createTxn", "moveToGoal", "createTask", "email", "generateBriefing", "tagTransaction"]),
      payload: z.record(z.unknown()).default({}),
    }),
  ),
  enabled: z.boolean().default(true),
  createdAt: timestampSchema.optional(),
});

export const briefingSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  type: z.enum(["morning", "evening", "weekly"]),
  content: z.string(),
  createdAt: timestampSchema,
  metrics: z.record(z.number()).default({}),
});

export type UserDoc = z.infer<typeof userSchema>;
export type HouseholdDoc = z.infer<typeof householdSchema>;
export type MemberDoc = z.infer<typeof memberSchema>;
export type AccountDoc = z.infer<typeof accountSchema>;
export type TransactionDoc = z.infer<typeof transactionSchema>;
export type BudgetDoc = z.infer<typeof budgetSchema>;
export type DebtDoc = z.infer<typeof debtSchema>;
export type IncomeStreamDoc = z.infer<typeof incomeStreamSchema>;
export type BillDoc = z.infer<typeof billSchema>;
export type GoalDoc = z.infer<typeof goalSchema>;
export type DocumentDoc = z.infer<typeof documentSchema>;
export type EventDoc = z.infer<typeof eventSchema>;
export type HabitDoc = z.infer<typeof habitSchema>;
export type AssetDoc = z.infer<typeof assetSchema>;
export type ShoppingListDoc = z.infer<typeof shoppingListSchema>;
export type SimulationDoc = z.infer<typeof simulationSchema>;
export type AutomationDoc = z.infer<typeof automationSchema>;
export type BriefingDoc = z.infer<typeof briefingSchema>;
