import { ImpactPlan } from "../graph/types";

export type ImpactPreviewInput = {
  intent: string;
  entityId?: string;
  patch?: Record<string, unknown>;
  amount?: number;
};

export function planImpact(input: ImpactPreviewInput): ImpactPlan {
  const warnings: string[] = [];
  const derivedWrites: ImpactPlan["derivedWrites"] = [];
  const automations: ImpactPlan["automations"] = [];
  const aggregatesToRecompute = new Set<string>(["bridge:overview", "bridge:queue"]);
  const kpiDelta: ImpactPlan["kpiDelta"] = {};

  switch (input.intent) {
    case "bill.pay": {
      const amount = Number(input.patch?.amount ?? input.amount ?? 0);
      if (amount > 500) {
        warnings.push("Payment exceeds variance threshold. Ensure cash runway is sufficient.");
      }
      derivedWrites.push({
        collection: "bills",
        id: String(input.entityId ?? "unknown"),
        change: "update",
        diff: { status: "paid", paidAt: new Date().toISOString() },
      });
      automations.push({ ruleId: "auto-nudge-vendor", action: "nudge", params: { channel: "email" } });
      kpiDelta.runwayDays = -Math.round(amount / 60);
      break;
    }
    case "goal.allocate": {
      const amount = Number(input.patch?.amount ?? 0);
      derivedWrites.push({
        collection: "goals",
        id: String(input.entityId ?? "goal"),
        change: "update",
        diff: { currentAmount: { $inc: amount } },
      });
      automations.push({ ruleId: "auto-briefing", action: "briefingAdd", params: { topic: "Goal progress" } });
      kpiDelta.goalEtaDeltaDays = -Math.round(amount / 150);
      break;
    }
    case "dose.log": {
      derivedWrites.push({
        collection: "doses",
        id: String(input.entityId ?? "dose"),
        change: "update",
        diff: { status: "taken", takenAt: new Date().toISOString() },
      });
      kpiDelta.adherence = 1;
      automations.push({ ruleId: "refill-window", action: "createEvent", params: { daysBefore: 3 } });
      break;
    }
    case "refill.request": {
      derivedWrites.push({
        collection: "refills",
        id: String(input.entityId ?? "refill"),
        change: "create",
        diff: { status: "submitted", requestedAt: new Date().toISOString() },
      });
      automations.push({ ruleId: "pharmacy-sync", action: "nudge", params: { channel: "sms" } });
      kpiDelta.runwayDays = 0;
      break;
    }
    case "txn.reclassify": {
      derivedWrites.push({
        collection: "transactions",
        id: String(input.entityId ?? "txn"),
        change: "update",
        diff: { category: input.patch?.category },
      });
      automations.push({ ruleId: "budget-recalc", action: "suggestBudget" });
      aggregatesToRecompute.add("cashflow:variance");
      break;
    }
    default: {
      derivedWrites.push({
        collection: "generic",
        id: String(input.entityId ?? "entity"),
        change: "update",
        diff: input.patch ?? {},
      });
      break;
    }
  }

  return {
    warnings,
    derivedWrites,
    automations,
    aggregatesToRecompute: Array.from(aggregatesToRecompute),
    kpiDelta: Object.keys(kpiDelta).length ? kpiDelta : undefined,
  };
}

