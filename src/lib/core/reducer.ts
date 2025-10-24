import { randomUUID } from "crypto";
import { Command } from "../graph/types";
import type { EventRecord } from "./eventLog";

export function reduceCommand(command: Command): EventRecord[] {
  const base = {
    correlationId: command.idempotencyKey,
  };

  switch (command.type) {
    case "bill.markPaid": {
      return [
        {
          id: randomUUID(),
          type: "bill.paid",
          occurredAt: new Date().toISOString(),
          payload: {
            billId: command.payload.billId,
            amount: command.payload.amount,
            paidAt: command.payload.paidAt ?? new Date().toISOString(),
          },
          ...base,
        },
      ];
    }
    case "goal.allocate": {
      return [
        {
          id: randomUUID(),
          type: "goal.allocated",
          occurredAt: new Date().toISOString(),
          payload: {
            goalId: command.payload.goalId,
            amount: command.payload.amount,
          },
          ...base,
        },
      ];
    }
    case "txn.reclassify.bulk": {
      return [
        {
          id: randomUUID(),
          type: "txn.reclassified",
          occurredAt: new Date().toISOString(),
          payload: {
            txIds: command.payload.txIds,
            category: command.payload.category,
          },
          ...base,
        },
      ];
    }
    case "doc.link": {
      return [
        {
          id: randomUUID(),
          type: "doc.linked",
          occurredAt: new Date().toISOString(),
          payload: {
            docId: command.payload.docId,
            entityId: command.payload.entityId,
            entityType: command.payload.entityType,
          },
          ...base,
        },
      ];
    }
    case "dose.log": {
      return [
        {
          id: randomUUID(),
          type: "dose.taken",
          occurredAt: new Date().toISOString(),
          payload: {
            medicationId: command.payload.medicationId,
            doseId: command.payload.doseId,
            takenAt: command.payload.takenAt ?? new Date().toISOString(),
          },
          ...base,
        },
      ];
    }
    case "refill.request": {
      return [
        {
          id: randomUUID(),
          type: "refill.requested",
          occurredAt: new Date().toISOString(),
          payload: {
            medicationId: command.payload.medicationId,
            refillId: command.payload.refillId ?? randomUUID(),
          },
          ...base,
        },
      ];
    }
    case "event.create": {
      return [
        {
          id: randomUUID(),
          type: "event.created",
          occurredAt: new Date().toISOString(),
          payload: command.payload,
          ...base,
        },
      ];
    }
    case "rule.create": {
      return [
        {
          id: randomUUID(),
          type: "rule.created",
          occurredAt: new Date().toISOString(),
          payload: command.payload,
          ...base,
        },
      ];
    }
    case "play.track": {
      return [
        {
          id: randomUUID(),
          type: "play.tracked",
          occurredAt: new Date().toISOString(),
          payload: command.payload,
          ...base,
        },
      ];
    }
    default:
      return [
        {
          id: randomUUID(),
          type: "command.received",
          occurredAt: new Date().toISOString(),
          payload: command as unknown as Record<string, unknown>,
          ...base,
        },
      ];
  }
}

