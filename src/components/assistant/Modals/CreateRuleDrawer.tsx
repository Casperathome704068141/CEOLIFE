"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CreateRuleDrawer({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (rule: { name: string; trigger: string; filters: string; actions: string }) => void;
}) {
  const [name, setName] = useState("Groceries > 90% budget");
  const [trigger, setTrigger] = useState("spend_ratio > 0.9 before month_end");
  const [filters, setFilters] = useState("category:groceries; household:1017");
  const [actions, setActions] = useState("nudge:Marcus; create_brief:coach");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full border-l border-slate-800 bg-slate-950/95 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-slate-100">Create rule</SheetTitle>
        </SheetHeader>
        <ScrollArea className="mt-6 h-[calc(100vh-10rem)] pr-4">
          <div className="flex flex-col gap-4">
            <Field label="Name">
              <Input value={name} onChange={(event) => setName(event.target.value)} className="bg-slate-900/70" />
            </Field>
            <Field label="Trigger">
              <Textarea value={trigger} onChange={(event) => setTrigger(event.target.value)} className="bg-slate-900/70" />
            </Field>
            <Field label="Filters">
              <Textarea value={filters} onChange={(event) => setFilters(event.target.value)} className="bg-slate-900/70" />
            </Field>
            <Field label="Actions">
              <Textarea value={actions} onChange={(event) => setActions(event.target.value)} className="bg-slate-900/70" />
            </Field>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-xs text-slate-300">
              Dry run matched 2 transactions in the last 30 days.
            </div>
            <Button
              className="self-start"
              onClick={() => onCreate?.({ name, trigger, filters, actions })}
            >
              Save rule
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-slate-400">{label}</Label>
      {children}
    </div>
  );
}
