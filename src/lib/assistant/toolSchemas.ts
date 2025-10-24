import { z } from "zod";

export const transactionToolSchema = z.object({
  householdId: z.string(),
  amount: z.number(),
  currency: z.string(),
  merchant: z.string().optional(),
  category: z.string().optional(),
  memo: z.string().optional(),
});

export const billToolSchema = z.object({
  billId: z.string().optional(),
  dueDate: z.string(),
  amount: z.number(),
  payFrom: z.string().optional(),
});

export const goalToolSchema = z.object({
  goalId: z.string().optional(),
  amount: z.number(),
  note: z.string().optional(),
});

export const scheduleToolSchema = z.object({
  title: z.string(),
  start: z.string(),
  end: z.string().optional(),
  recurrence: z.string().optional(),
  channel: z.enum(["calendar", "whatsapp", "sms"]).default("calendar"),
});

export const ruleToolSchema = z.object({
  name: z.string(),
  trigger: z.string(),
  filters: z.array(z.string()).optional(),
  actions: z.array(z.string()),
  enable: z.boolean().default(true),
});

export const simulateToolSchema = z.object({
  scenario: z.string(),
  horizon: z.string().optional(),
});

export const vaultToolSchema = z.object({
  label: z.string(),
  expiresAt: z.string().optional(),
  notes: z.string().optional(),
});

export const nudgeToolSchema = z.object({
  contact: z.string(),
  message: z.string(),
  channel: z.enum(["sms", "whatsapp"]).default("sms"),
});

export const toolSchemas = {
  transaction: transactionToolSchema,
  bill: billToolSchema,
  goal: goalToolSchema,
  schedule: scheduleToolSchema,
  rule: ruleToolSchema,
  simulate: simulateToolSchema,
  vault: vaultToolSchema,
  nudge: nudgeToolSchema,
};

export type ToolName = keyof typeof toolSchemas;

export function validateToolCall(tool: ToolName, payload: unknown) {
  const schema = toolSchemas[tool];
  return schema.parse(payload);
}
