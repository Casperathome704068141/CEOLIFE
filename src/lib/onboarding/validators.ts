import { z } from "zod";

export const IntegrationProviderSchema = z.object({
  provider: z.enum(["google", "outlook"]),
  id: z.string(),
  name: z.string(),
});

export const ScheduleSchema = z.union([
  z.object({
    type: z.literal("fixed"),
    times: z.array(z.string()),
  }),
  z.object({
    type: z.literal("interval"),
    hours: z.number(),
  }),
]);

export const SetupSchema = z.object({
  version: z.literal(1),
  progress: z.number().min(0).max(100),
  steps: z.object({
    accounts: z.boolean(),
    people: z.boolean(),
    documents: z.boolean(),
    household: z.boolean(),
    finance: z.boolean(),
    health: z.boolean(),
    automations: z.boolean(),
    goals: z.boolean(),
  }),
  data: z.object({
    integrations: z.object({
      plaid: z.boolean().optional(),
      calendars: z.array(IntegrationProviderSchema).optional(),
      emailIngest: z.boolean().optional(),
      drive: z.boolean().optional(),
      health: z.array(z.enum(["apple", "google", "fitbit"])).optional(),
    }),
    contacts: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          relation: z.enum(["head", "family", "guest", "vendor"]).default("family"),
          phone: z.string().optional(),
          defaultChannel: z.enum(["whatsapp", "sms", "none"]).default("whatsapp"),
          notes: z.string().optional(),
        })
      )
      .optional(),
    docs: z
      .array(
        z.object({
          id: z.string(),
          filename: z.string(),
          type: z.enum(["id", "policy", "contract", "receipt", "medical", "other"]),
          expiresAt: z.string().nullable(),
          tags: z.array(z.string()).optional(),
        })
      )
      .optional(),
    household: z
      .object({
        name: z.string(),
        address: z.string().optional(),
        utilities: z.array(z.enum(["internet", "electricity", "water", "gas"])).optional(),
        assets: z
          .array(
            z.object({
              id: z.string(),
              label: z.string(),
              category: z.enum(["appliance", "electronics", "vehicle", "furniture", "other"]),
              serial: z.string().optional(),
              warrantyEnd: z.string().nullable(),
            })
          )
          .optional(),
      })
      .optional(),
    finance: z
      .object({
        currency: z.string().default("CAD"),
        income: z.array(
          z.object({
            name: z.string(),
            amount: z.number(),
            frequency: z.enum(["weekly", "biweekly", "monthly"]),
            nextDate: z.string(),
          })
        ),
        bills: z.array(
          z.object({
            name: z.string(),
            amount: z.number(),
            dueDay: z.number(),
            autopay: z.boolean().default(false),
            tag: z.string().optional(),
          })
        ),
        budgetTemplate: z
          .array(
            z.object({
              category: z.string(),
              percent: z.number(),
            })
          )
          .optional(),
      })
      .optional(),
    care: z
      .array(
        z.object({
          name: z.string(),
          relation: z.string(),
          meds: z.array(
            z.object({
              name: z.string(),
              strengthMg: z.number().optional(),
              schedule: ScheduleSchema,
              unitsPerDose: z.number(),
              pillsOnHand: z.number().optional(),
              lowStockDays: z.number().default(7),
            })
          ),
        })
      )
      .optional(),
    rules: z
      .array(
        z.object({
          id: z.string(),
          trigger: z.string(),
          action: z.string(),
        })
      )
      .optional(),
    goals: z
      .array(
        z.object({
          name: z.string(),
          target: z.number(),
          deadline: z.string().optional(),
          priority: z.number().min(1).max(5),
        })
      )
      .optional(),
  }),
});

export type Setup = z.infer<typeof SetupSchema>;
export type StepKey = keyof Setup["steps"];
export type SetupData = Setup["data"];

export const StepOrder: StepKey[] = [
  "accounts",
  "people",
  "documents",
  "household",
  "finance",
  "health",
  "automations",
  "goals",
];

export type PreviewResponse = {
  finance?: {
    forecast: number[];
    bills: Array<{ name: string; due: string; amount: number }>;
  };
  care?: Array<{ person: string; nextDose: string }>;
  rules?: Array<{ id: string; count: number }>;
  readiness: number;
};
