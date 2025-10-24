"use client";

import { useCallback } from "react";
import { useImpactGuard } from "./useImpactGuard";
import { Command } from "../graph/types";

export type OmniResult = {
  status: "queued" | "committed" | "unknown";
  message: string;
};

function parseInput(input: string): Command | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const idempotencyKey = crypto.randomUUID();

  if (trimmed.startsWith("/receipt")) {
    return {
      type: "doc.link",
      payload: {
        docId: `doc-${Date.now()}`,
        entityId: "bill-electric",
        entityType: "bill",
      },
      idempotencyKey,
    };
  }

  if (trimmed.startsWith("/nudge")) {
    const [, ...rest] = trimmed.split(" ");
    return {
      type: "rule.create",
      payload: {
        audience: rest.join(" ") || "Household",
        message: "Manual nudge from omnibox",
      },
      idempotencyKey,
    };
  }

  if (trimmed.startsWith("/txn")) {
    return {
      type: "txn.reclassify.bulk",
      payload: {
        txIds: ["txn-latest"],
        category: "Operations",
      },
      idempotencyKey,
    };
  }

  return {
    type: "event.create",
    payload: {
      title: trimmed,
      startsAt: new Date().toISOString(),
    },
    idempotencyKey,
  };
}

export function useOmniBox() {
  const { commit } = useImpactGuard();

  const submit = useCallback(
    async (value: string): Promise<OmniResult> => {
      const command = parseInput(value);
      if (!command) {
        return { status: "unknown", message: "No command detected" };
      }

      await commit(command);
      return { status: "committed", message: "Command routed" };
    },
    [commit]
  );

  return { submit };
}

