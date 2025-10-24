"use client";

import { useMemo } from "react";
import { useAssistantContext } from "@/lib/assistant/context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MODES = [
  { value: "brief", label: "Brief" },
  { value: "capture", label: "Capture" },
  { value: "plan", label: "Plan" },
  { value: "coach", label: "Coach" },
] as const;

export function ModeToggle() {
  const { mode, setMode } = useAssistantContext();
  const placeholder = useMemo(() => MODES.find((item) => item.value === mode)?.label ?? "Brief", [mode]);
  return (
    <Select value={mode} onValueChange={(value) => setMode(value as typeof mode)}>
      <SelectTrigger className="w-full bg-slate-900/70 text-slate-200">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-slate-900/90 text-slate-100">
        {MODES.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
