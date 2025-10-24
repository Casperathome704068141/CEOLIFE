"use client";

import { cn } from "@/lib/utils";
import type { ExecLogEntry } from "@/lib/assistant/types";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw, RotateCcw } from "lucide-react";

export function ExecLog({
  log,
  onUndo,
  onRetry,
}: {
  log: ExecLogEntry;
  onUndo?: (log: ExecLogEntry) => void;
  onRetry?: (log: ExecLogEntry) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
        log.state === "success" && "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
        log.state === "error" && "border-red-500/40 bg-red-500/10 text-red-200",
        log.state === "running" && "border-sky-500/40 bg-sky-500/10 text-sky-200",
        log.state === "queued" && "border-amber-500/40 bg-amber-500/10 text-amber-200",
      )}
    >
      {log.state === "running" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {log.state === "error" && <RefreshCcw className="h-3.5 w-3.5" />}
      <span className="font-medium capitalize">{log.state}</span>
      {log.error && <span className="text-xs text-red-100/80">{log.error}</span>}
      {log.undoable && log.state === "success" && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-emerald-200 hover:text-emerald-100"
          onClick={() => onUndo?.(log)}
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}
      {log.state === "error" && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-red-200 hover:text-red-100"
          onClick={() => onRetry?.(log)}
        >
          <RefreshCcw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
