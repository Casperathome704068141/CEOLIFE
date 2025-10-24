"use client";

import { useMemo } from "react";
import { useAssistantContext } from "@/lib/assistant/context";
import { ModeToggle } from "./mode-toggle";
import { SidePanelCards } from "./SidePanelCards";

export function SidePanel({ onQuickAction }: { onQuickAction?: (action: string) => void }) {
  const { mode, chips } = useAssistantContext();
  const activeChips = useMemo(() => chips.filter((chip) => chip.active), [chips]);
  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl border border-slate-900/60 bg-slate-950/70 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-slate-500">Mode</p>
        <ModeToggle />
        <p className="text-xs text-slate-400">{activeChips.length} session constraints in {mode} mode</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <SidePanelCards onQuickAction={onQuickAction} />
      </div>
    </div>
  );
}
