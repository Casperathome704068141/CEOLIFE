"use client";

import { CheckCircle2 } from "lucide-react";
import type { DecisionOption } from "@/lib/assistant/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DecisionCard({
  title,
  options,
  onSelect,
}: {
  title: string;
  options: DecisionOption[];
  onSelect?: (option: DecisionOption) => void;
}) {
  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-sm text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-100">{option.label}</p>
                {option.recommended && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Recommended
                  </span>
                )}
              </div>
              {option.description && (
                <p className="text-xs text-slate-400">{option.description}</p>
              )}
            </div>
            <Button size="sm" onClick={() => onSelect?.(option)}>
              {option.action.label || "Select"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
