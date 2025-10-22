"use server";

import { randomUUID } from "crypto";

import type {
  AggregateSnapshotDoc,
  AutomationDoc,
  MerchantRuleDoc,
  NudgeDoc,
  SettlementDoc,
} from "@/lib/schemas";

export type AutomationEvent = {
  type: "transaction" | "bill" | "cron" | "habit" | "threshold";
  scope: "user" | "household";
  householdId?: string;
  ownerId: string;
  payload: Record<string, unknown>;
};

export type AutomationResult = {
  ruleId: string;
  status: "executed" | "skipped" | "error";
  actionsTriggered: string[];
  message?: string;
};

export type MonthlyAudit = {
  period: { year: number; month: number };
  findings: string[];
  risks: string[];
  opportunities: string[];
  suggestedAutomations: Array<Pick<AutomationDoc, "id" | "actions" | "trigger"> & { summary: string }>;
  metrics: Record<string, number>;
};

/**
 * Trigger WhatsApp or SMS delivery for a pre-templated message.
 * In production this will call a Firebase Function that wraps the Twilio Business API.
 */
export async function sendNudge(input: {
  ownerId: string;
  to: string;
  name?: string;
  channel: "whatsapp" | "sms";
  templateId: string;
  vars: Record<string, string>;
  attachmentUrl?: string;
}): Promise<{ id: string; status: "sent" | "queued" | "error" }> {
  const id = randomUUID();
  try {
    // Server-side integration placeholder. The Firebase Function will persist to Firestore nudges collection.
    const payload: Partial<NudgeDoc> = {
      id,
      ownerId: input.ownerId,
      toPhone: input.to,
      toName: input.name,
      channel: input.channel,
      templateId: input.templateId,
      payload: input.vars,
      attachmentUrl: input.attachmentUrl,
      status: "queued",
      createdAt: new Date(),
    };

    console.info("[sendNudge] queued", payload);
    return { id, status: "queued" };
  } catch (error) {
    console.error("[sendNudge] failed", error);
    return { id, status: "error" };
  }
}

/**
 * Aggregate month end telemetry into an executive audit.
 * The Firebase Function implementation will enrich metrics with live Firestore data and AI generated recommendations.
 */
export async function generateMonthlyAudit(
  uid: string,
  period: { year: number; month: number },
): Promise<MonthlyAudit> {
  const baselineMetrics = {
    netWorth: 0,
    monthlyBurn: 0,
    runwayDays: 0,
    budgetVariance: 0,
    goalDelta: 0,
  } satisfies Record<string, number>;

  return {
    period,
    findings: [`No live data connected for ${uid}. Link Plaid and wellness feeds to unlock Beno audits.`],
    risks: ["Budget monitoring inactive — enable category alerts."],
    opportunities: ["Capture new recurring charges using the automation builder."],
    suggestedAutomations: [
      {
        id: "auto-buffer-top-up",
        summary: "Sweep $400 to the emergency fund if checking balance > $5K after payday.",
        trigger: { type: "threshold", expression: "balance > 5000" },
        actions: [
          {
            type: "moveToGoal",
            payload: { goalId: "emergency-fund", amount: 400 },
          },
        ],
      },
    ],
    metrics: baselineMetrics,
  };
}

/**
 * Evaluate automation rules for a given event. This runs inside a Cloud Function with JSON-logic evaluation.
 */
export async function evaluateRulesOnEvent(evt: AutomationEvent): Promise<AutomationResult[]> {
  console.info("[evaluateRulesOnEvent] received", evt);
  return [
    {
      ruleId: "demo-rule",
      status: "skipped",
      actionsTriggered: [],
      message: "JSON logic engine not yet connected.",
    },
  ];
}

/**
 * Recompute household aggregates after ledger or settlement changes. Called by Cloud Functions.
 */
export async function recomputeHouseholdBalances(hid: string): Promise<void> {
  const snapshot: AggregateSnapshotDoc = {
    id: "current",
    householdId: hid,
    netWorth: 0,
    monthlyBurn: 0,
    runwayDays: 0,
    budgetUtilization: 0,
    updatedAt: new Date(),
  };

  console.info("[recomputeHouseholdBalances] placeholder snapshot", snapshot);
}

export type { MerchantRuleDoc, SettlementDoc };
