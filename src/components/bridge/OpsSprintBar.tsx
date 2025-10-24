"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const modes: Array<{ value: "monitor" | "focus"; label: string }> = [
  { value: "monitor", label: "Monitor" },
  { value: "focus", label: "Focus" },
];

type Props = {
  mode: "monitor" | "focus";
  onModeChange: (mode: "monitor" | "focus") => void;
  remainingSeconds?: number;
  completed?: number;
  total?: number;
};

export function OpsSprintBar({ mode, onModeChange, remainingSeconds = 0, completed = 0, total = 5 }: Props) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = String(remainingSeconds % 60).padStart(2, "0");
  const progress = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-900/70 bg-slate-950/80 p-4 shadow-lg lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        {modes.map(option => (
          <Button
            key={option.value}
            size="sm"
            variant={mode === option.value ? "default" : "outline"}
            className={
              mode === option.value
                ? "rounded-full bg-cyan-500 text-slate-900 hover:bg-cyan-400"
                : "rounded-full border-slate-700 text-slate-200"
            }
            onClick={() => onModeChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      {mode === "focus" && (
        <div className="flex flex-1 flex-col gap-2 lg:max-w-md">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Ops sprint</span>
            <span>
              {minutes}:{seconds} · {completed}/{total} items
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-800" />
        </div>
      )}
    </div>
  );
}

