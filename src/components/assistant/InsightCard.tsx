"use client";

import { AlertCircle, Lightbulb, ShieldAlert } from "lucide-react";
import type { InsightCardPayload, Action } from "@/lib/assistant/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionBar } from "./ActionBar";

const ICONS = {
  info: Lightbulb,
  warn: AlertCircle,
  risk: ShieldAlert,
};

const BADGE_VARIANTS: Record<InsightCardPayload["severity"], string> = {
  info: "bg-sky-500/20 text-sky-200",
  warn: "bg-amber-500/20 text-amber-200",
  risk: "bg-rose-500/20 text-rose-200",
};

export function InsightCard({ card, onAction }: { card: InsightCardPayload; onAction?: (action: Action) => void }) {
  const Icon = ICONS[card.severity] ?? Lightbulb;
  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-sm text-slate-100">
          <Icon className="h-4 w-4" />
          {card.title}
        </CardTitle>
        <Badge className={BADGE_VARIANTS[card.severity]}> {card.severity.toUpperCase()} </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-300">{card.detail}</p>
        <ActionBar actions={card.actions} onAction={(action) => onAction?.(action)} />
      </CardContent>
    </Card>
  );
}
