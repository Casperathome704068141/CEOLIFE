"use client";

import { useAssistantContext } from "@/lib/assistant/context";
import { Badge } from "@/components/ui/badge";

export function ContextChips() {
  const { chips, toggleChip } = useAssistantContext();
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Badge
          key={chip.id}
          variant={chip.active ? "default" : "outline"}
          onClick={() => toggleChip(chip.id)}
          className="cursor-pointer bg-slate-900/60 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-200 hover:bg-slate-800"
        >
          {chip.label}
        </Badge>
      ))}
    </div>
  );
}
