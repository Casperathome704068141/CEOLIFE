"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProposedAction } from "@/lib/assistant/types";

export function ImportDialog({
  open,
  onOpenChange,
  payload,
  onImport,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload?: { type: string; confidence: number; proposedActions: ProposedAction[] };
  onImport?: (actions: ProposedAction[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const actions = payload?.proposedActions ?? [];
  const summary = useMemo(() => `${payload?.type ?? "unknown"} (${Math.round((payload?.confidence ?? 0) * 100)}% sure)`, [payload]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-slate-800 bg-slate-950/90">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Import capture</DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            {summary}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[300px] space-y-3 pr-4">
          <div className="space-y-2">
            {actions.map((action) => (
              <label
                key={action.label}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3"
              >
                <Checkbox
                  checked={selected.includes(action.label)}
                  onCheckedChange={(checked) => {
                    setSelected((prev) =>
                      checked
                        ? [...prev, action.label]
                        : prev.filter((item) => item !== action.label),
                    );
                  }}
                />
                <div className="space-y-1">
                  <p className="text-sm text-slate-200">{action.label}</p>
                  <pre className="whitespace-pre-wrap text-[11px] text-slate-400">
                    {JSON.stringify(action.payloadPreview, null, 2)}
                  </pre>
                </div>
              </label>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onImport?.(actions.filter((action) => selected.includes(action.label)))
            }
          >
            Import selected
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
