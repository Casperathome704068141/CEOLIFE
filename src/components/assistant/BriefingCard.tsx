"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { BriefingSection, Action } from "@/lib/assistant/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionBar } from "./ActionBar";

function TrendIcon({ trend }: { trend?: "up" | "down" | "flat" }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-rose-400" />;
  return <Minus className="h-4 w-4 text-slate-400" />;
}

export function BriefingCard({
  sections,
  onAction,
}: {
  sections: BriefingSection[];
  onAction?: (action: Action) => void;
}) {
  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm text-slate-200">
          Morning briefing
          <Badge variant="secondary" className="bg-slate-800 text-slate-200">
            Structured
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="space-y-2 rounded-2xl border border-slate-800/80 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-100">{section.title}</p>
                {section.description && (
                  <p className="text-xs text-slate-400">{section.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                {section.kpi && <span>{section.kpi}</span>}
                <TrendIcon trend={section.trend} />
              </div>
            </div>
            {section.insight && (
              <p className="rounded-lg bg-slate-950/60 p-3 text-xs text-slate-300">
                {section.insight}
              </p>
            )}
            <ActionBar
              actions={section.actions}
              onAction={(action) => onAction?.(action)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
