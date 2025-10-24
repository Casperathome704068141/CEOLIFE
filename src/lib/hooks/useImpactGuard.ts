"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImpactPlan, Command } from "../graph/types";

export type ImpactPreviewRequest = {
  intent: string;
  entityId?: string;
  patch?: Record<string, unknown>;
};

export function useImpactGuard() {
  const queryClient = useQueryClient();

  const preview = useCallback(async (request: ImpactPreviewRequest) => {
    const response = await fetch("/api/impact/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to generate impact preview");
    }

    const payload = (await response.json()) as { plan: ImpactPlan };
    return payload.plan;
  }, []);

  const commit = useCallback(
    async (command: Command) => {
      const response = await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Command failed");
      }

      const payload = await response.json();
      queryClient.invalidateQueries({ queryKey: ["bridge", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["bridge", "queue"] });
      return payload;
    },
    [queryClient]
  );

  return { preview, commit };
}

