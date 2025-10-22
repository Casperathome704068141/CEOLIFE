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

const quietHoursSchema = z
  .object({ start: z.string().regex(/^[0-2]\d:[0-5]\d$/), end: z.string().regex(/^[0-2]\d:[0-5]\d$/) })
  .partial();

export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1),
  photoURL: z.string().url().optional(),
  role: z.literal("HEAD"),
  preferences: z
    .object({
      locale: z.string().default("en-CA"),
      currency: currencySchema.default("CAD"),
      theme: z.enum(["system", "light", "dark"]).default("dark"),
      notifications: z
        .object({
          channels: z.record(z.boolean()).default({}),
          quietHours: quietHoursSchema.optional(),
        })
        .default({ channels: {} }),
    })
    .default({}),
  featureFlags: z.record(z.boolean()).default({}),
  onboardingState: z
    .object({
      completed: z.boolean().default(false),
      steps: z.record(z.boolean()).default({}),
      lastVisitedRoute: z.string().optional(),
    })
    .default({}),
  security: z
    .object({
      idleLockMinutes: z.number().int().positive().max(180).default(10),
      passkeyRegistered: z.boolean().default(false),
      zeroKnowledgeVault: z.boolean().default(true),
    })
    .default({}),
  messaging: z
    .object({
      twilioSid: z.string().optional(),
      twilioToken: z.string().optional(),
      whatsappSender: z.string().optional(),
      defaultCountryCode: z.string().optional(),
      quietHours: quietHoursSchema.optional(),
    })
    .default({}),
  createdAt: timestampSchema.optional(),
  updatedAt: timestampSchema.optional(),
});

export const householdSchema = z.object({
  id: z.string(),
  ownerUid: z.string(),
  name: z.string(),
  address: z.string().optional(),
  members: z.array(z.string()).default([]),
  currency: currencySchema.default("CAD"),
  timezone: z.string().default("America/Toronto"),
  quietHours: quietHoursSchema.optional(),
  sharedSettings: z
    .object({
      messagingChannel: z.enum(["whatsapp", "sms", "email"]).optional(),
      defaultNudgeTemplates: z.array(z.string()).default([]),
    })
    .default({ defaultNudgeTemplates: [] }),
  createdAt: timestampSchema.optional(),
  updatedAt: timestampSchema.optional(),
});

export const memberSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  displayName: z.string(),
  role: z.enum(["head", "member", "guest", "service"]).default("member"),
  userRef: z.string().optional(),
  permissions: z.record(z.boolean()).default({}),
  contact: z
    .object({
      phone: z.string().optional(),
      email: z.string().email().optional(),
      preferredChannel: z.enum(["whatsapp", "sms", "email"]).optional(),
    })
    .default({}),
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
  splitParentId: z.string().optional(),
  splits: z.array(
    z.object({
      id: z.string(),
      amount: z.number(),
      category: z.string(),
      memo: z.string().optional(),
    }),
  ).default([]),
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
  encryption: z
    .object({
      algorithm: z.literal("AES-GCM"),
      keyId: z.string(),
      wrappedKey: z.string(),
    })
    .optional(),
  expireDate: timestampSchema.optional(),
  tags: z.array(z.string()).default([]),
  shareACL: z
    .array(
      z.object({
        subject: z.string(),
        role: z.enum(["viewer", "editor", "emergency"]),
        expiresAt: timestampSchema.optional(),
      }),
    )
    .default([]),
  shareSubjects: z.record(z.enum(["viewer", "editor", "emergency"]).optional()).default({}),
  createdAt: timestampSchema.optional(),
});

export const eventSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  calendarId: z.string(),
  title: z.string(),
  start: timestampSchema,
  end: timestampSchema,
  location: z.string().optional(),
  linkedEntities: z.array(z.string()).default([]),
  reminders: z.array(z.object({ minutesBefore: z.number().int() })).default([]),
  snoozedUntil: timestampSchema.optional(),
  sharedAsNudge: z.boolean().default(false),
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
      lastPurchasedAt: timestampSchema.optional(),
      notes: z.string().optional(),
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
  ownerId: z.string(),
  ownerScope: z.enum(["user", "household"]),
  trigger: z.object({
    type: z.enum(["cron", "event", "threshold", "webhook"]),
    expression: z.string(),
  }),
  condition: z.record(z.unknown()).optional(),
  actions: z.array(
    z.object({
      type: z.enum([
        "notify",
        "createTxn",
        "moveToGoal",
        "createTask",
        "createEvent",
        "email",
        "generateBriefing",
        "tagTransaction",
        "sendNudge",
      ]),
      payload: z.record(z.unknown()).default({}),
    }),
  ),
  enabled: z.boolean().default(true),
  createdAt: timestampSchema.optional(),
});

export const briefingSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  type: z.enum(["morning", "evening", "weekly", "monthlyAudit"]),
  content: z.string(),
  createdAt: timestampSchema,
  metrics: z.record(z.number()).default({}),
  recommendations: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        action: z.enum(["simulate", "createRule", "nudge", "accept"]),
        details: z.string().optional(),
      }),
    )
    .default([]),
});

export const nudgeSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  toPhone: z.string(),
  toName: z.string().optional(),
  channel: z.enum(["whatsapp", "sms"]),
  templateId: z.string(),
  payload: z.record(z.unknown()),
  attachmentUrl: z.string().url().optional(),
  status: z.enum(["queued", "sent", "delivered", "error"]).default("queued"),
  sentAt: timestampSchema.optional(),
  deliveredAt: timestampSchema.optional(),
  error: z.string().optional(),
  createdAt: timestampSchema.optional(),
});

export const settlementSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  payerName: z.string(),
  amount: z.number(),
  currency: currencySchema,
  date: timestampSchema,
  method: z.string().optional(),
  note: z.string().optional(),
  links: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
  createdAt: timestampSchema.optional(),
});

export const merchantRuleSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  merchant: z.string(),
  defaultCategory: z.string(),
  notes: z.string().optional(),
  createdAt: timestampSchema.optional(),
  updatedAt: timestampSchema.optional(),
});

export const aggregateSnapshotSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  netWorth: z.number(),
  monthlyBurn: z.number(),
  runwayDays: z.number(),
  budgetUtilization: z.number(),
  updatedAt: timestampSchema,
});

export const contactSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  channelPreference: z.enum(["whatsapp", "sms", "email"]).optional(),
  notes: z.string().optional(),
  createdAt: timestampSchema.optional(),
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
export type NudgeDoc = z.infer<typeof nudgeSchema>;
export type SettlementDoc = z.infer<typeof settlementSchema>;
export type MerchantRuleDoc = z.infer<typeof merchantRuleSchema>;
export type AggregateSnapshotDoc = z.infer<typeof aggregateSnapshotSchema>;
export type ContactDoc = z.infer<typeof contactSchema>;
