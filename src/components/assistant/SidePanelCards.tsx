"use client";

import { CalendarDays, CreditCard, HeartPulse, Target, PlusCircle, Receipt, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SidePanelCards({
  onQuickAction,
}: {
  onQuickAction?: (action: string) => void;
}) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-4 p-4">
        <ScheduleCapsule onQuickAction={onQuickAction} />
        <BillsCapsule onQuickAction={onQuickAction} />
        <CareCapsule onQuickAction={onQuickAction} />
        <GoalsCapsule onQuickAction={onQuickAction} />
        <QuickActions onQuickAction={onQuickAction} />
        <SavedPrompts onQuickAction={onQuickAction} />
      </div>
    </ScrollArea>
  );
}

function ScheduleCapsule({ onQuickAction }: { onQuickAction?: (action: string) => void }) {
  return (
    <Card className="border-slate-800/80 bg-slate-950/60">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-300" />
          <CardTitle className="text-sm text-slate-200">Today</CardTitle>
        </div>
        <p className="text-xs text-slate-400">Strategy standup 9:30 • Care check-in 13:00</p>
      </CardHeader>
      <CardContent>
        <Button
          size="sm"
          variant="secondary"
          className="text-xs"
          onClick={() => onQuickAction?.("create-event")}
        >
          Add quick event
        </Button>
      </CardContent>
    </Card>
  );
}

function BillsCapsule({ onQuickAction }: { onQuickAction?: (action: string) => void }) {
  return (
    <Card className="border-slate-800/80 bg-slate-950/60">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-slate-300" />
          <CardTitle className="text-sm text-slate-200">Bills</CardTitle>
        </div>
        <p className="text-xs text-slate-400">5 due • 2 autopay eligible</p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" className="text-xs" onClick={() => onQuickAction?.("record-payment")}>
          Record payment
        </Button>
        <Button size="sm" variant="secondary" className="text-xs" onClick={() => onQuickAction?.("schedule-bill")}>
          Schedule
        </Button>
      </CardContent>
    </Card>
  );
}

function CareCapsule({ onQuickAction }: { onQuickAction?: (action: string) => void }) {
  return (
    <Card className="border-slate-800/80 bg-slate-950/60">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-slate-300" />
          <CardTitle className="text-sm text-slate-200">Care</CardTitle>
        </div>
        <p className="text-xs text-slate-400">Theo: Hydroxyurea refill by Wed</p>
      </CardHeader>
      <CardContent>
        <Button size="sm" variant="secondary" className="text-xs" onClick={() => onQuickAction?.("record-dose")}>
          Record dose
        </Button>
      </CardContent>
    </Card>
  );
}

function GoalsCapsule({ onQuickAction }: { onQuickAction?: (action: string) => void }) {
  return (
    <Card className="border-slate-800/80 bg-slate-950/60">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-slate-300" />
          <CardTitle className="text-sm text-slate-200">Goals</CardTitle>
        </div>
        <p className="text-xs text-slate-400">Emergency fund 78% • Tuition 44%</p>
      </CardHeader>
      <CardContent>
        <Button size="sm" variant="secondary" className="text-xs" onClick={() => onQuickAction?.("fund-goal")}>
          Fund goal
        </Button>
      </CardContent>
    </Card>
  );
}

function QuickActions({ onQuickAction }: { onQuickAction?: (action: string) => void }) {
  const actions = [
    { icon: PlusCircle, label: "Add transaction", action: "add-transaction" },
    { icon: Receipt, label: "Scan receipt", action: "scan-receipt" },
    { icon: CalendarDays, label: "Create event", action: "create-event" },
    { icon: CreditCard, label: "Record payment", action: "record-payment" },
    { icon: MessageCircle, label: "Send nudge", action: "send-nudge" },
  ];
  return (
    <Card className="border-slate-800/80 bg-slate-950/60">
      <CardHeader>
        <CardTitle className="text-sm text-slate-200">Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {actions.map(({ icon: Icon, label, action }) => (
          <Button
            key={action}
            size="sm"
            variant="secondary"
            className="flex items-center gap-2 text-xs"
            onClick={() => onQuickAction?.(action)}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function SavedPrompts({ onQuickAction }: { onQuickAction?: (action: string) => void }) {
  const prompts = [
    "Summarize anomalies (7d)",
    "Draft evening brief",
    "Plan payday routine",
  ];
  return (
    <Card className="border-slate-800/80 bg-slate-950/60">
      <CardHeader>
        <CardTitle className="text-sm text-slate-200">Saved prompts</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {prompts.map((prompt) => (
          <Button
            key={prompt}
            size="sm"
            variant="ghost"
            className="justify-start text-xs text-slate-300 hover:bg-slate-900/80"
            onClick={() => onQuickAction?.(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
