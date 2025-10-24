"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Action } from "@/lib/assistant/types";

const ACTION_LABELS: Record<string, string> = {
  accept: "Accept",
  schedule: "Schedule",
  simulate: "Simulate",
  nudge: "Nudge",
  open: "Open in…",
};

export function ActionBar({
  actions,
  onAction,
}: {
  actions?: Action[];
  onAction?: (action: Action) => Promise<void> | void;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!actions?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.id}
          size="sm"
          variant={action.type === "accept" ? "default" : "secondary"}
          disabled={action.disabled || loadingId === action.id}
          onClick={async () => {
            if (!onAction) return;
            setLoadingId(action.id);
            await onAction(action);
            setLoadingId(null);
          }}
        >
          {loadingId === action.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            action.label ?? ACTION_LABELS[action.type] ?? "Run"
          )}
        </Button>
      ))}
    </div>
  );
}
