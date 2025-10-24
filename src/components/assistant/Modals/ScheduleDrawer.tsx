"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function ScheduleDrawer({
  open,
  onOpenChange,
  onSchedule,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule?: (payload: { title: string; date: string; channel: string; note: string; share: boolean }) => void;
}) {
  const [title, setTitle] = useState("Record payment follow-up");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [channel, setChannel] = useState("calendar");
  const [share, setShare] = useState(true);
  const [note, setNote] = useState("Attach rent ledger and notify Marcus");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full border-l border-slate-800 bg-slate-950/95 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-slate-100">Schedule</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <Field label="Title">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} className="bg-slate-900/70" />
          </Field>
          <Field label="Start">
            <Input
              type="datetime-local"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="bg-slate-900/70"
            />
          </Field>
          <Field label="Channel">
            <Input value={channel} onChange={(event) => setChannel(event.target.value)} className="bg-slate-900/70" />
          </Field>
          <Field label="Note">
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} className="bg-slate-900/70" />
          </Field>
          <div className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3">
            <div>
              <p className="text-sm text-slate-200">Share update via WhatsApp</p>
              <p className="text-xs text-slate-400">Respect quiet hours when off</p>
            </div>
            <Switch checked={share} onCheckedChange={setShare} />
          </div>
          <Button
            onClick={() => onSchedule?.({ title, date, channel, note, share })}
            className="self-start"
          >
            Schedule
          </Button>
        </div>
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
