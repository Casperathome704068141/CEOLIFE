"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShockEvent, ShockEventType } from "@/lib/sim/types";

interface ShockEventsEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: ShockEvent[];
  onSave: (events: ShockEvent[]) => void;
}

const eventTypes: { label: string; value: ShockEventType }[] = [
  { label: "Unexpected expense", value: "unexpected-expense" },
  { label: "Job loss", value: "job-loss" },
  { label: "Bonus", value: "bonus" },
];

export function ShockEventsEditor({ open, onOpenChange, events, onSave }: ShockEventsEditorProps) {
  const [local, setLocal] = useState<ShockEvent[]>([]);

  useEffect(() => {
    if (open) {
      setLocal(events.length ? events : []);
    }
  }, [open, events]);

  const updateEvent = (index: number, patch: Partial<ShockEvent>) => {
    setLocal((prev) => prev.map((event, idx) => (idx === index ? { ...event, ...patch } : event)));
  };

  const removeEvent = (index: number) => {
    setLocal((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addEvent = () => {
    setLocal((prev) => [...prev, { monthOffset: 0, type: "unexpected-expense", amount: 0 }]);
  };

  const handleSave = () => {
    onSave(local);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-3xl border border-slate-900/80 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle>Shock events</DialogTitle>
          <DialogDescription>Model windfalls or setbacks that hit specific months.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {local.length === 0 ? (
            <p className="text-sm text-slate-400">No events yet. Add an unexpected expense, job loss, or bonus.</p>
          ) : (
            <div className="space-y-2">
              {local.map((event, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr,1fr,1fr,auto] items-center gap-3 rounded-2xl border border-slate-900/70 bg-slate-900/40 px-4 py-3"
                >
                  <div className="space-y-1 text-xs text-slate-400">
                    <span>Month offset</span>
                    <Input
                      type="number"
                      value={event.monthOffset}
                      min={0}
                      onChange={(e) => updateEvent(index, { monthOffset: Number(e.target.value) })}
                      className="rounded-2xl border-slate-800 bg-slate-950/60 text-slate-100"
                    />
                  </div>
                  <div className="space-y-1 text-xs text-slate-400">
                    <span>Type</span>
                    <Select
                      value={event.type}
                      onValueChange={(value: ShockEventType) => updateEvent(index, { type: value })}
                    >
                      <SelectTrigger className="rounded-2xl border-slate-800 bg-slate-950/60 text-slate-100">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border border-slate-800 bg-slate-950/90 text-slate-100">
                        {eventTypes.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 text-xs text-slate-400">
                    <span>Amount</span>
                    <Input
                      type="number"
                      value={event.amount}
                      onChange={(e) => updateEvent(index, { amount: Number(e.target.value) })}
                      className="rounded-2xl border-slate-800 bg-slate-950/60 text-slate-100"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => removeEvent(index)}
                    className="rounded-2xl text-slate-300 hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Button onClick={addEvent} variant="secondary" className="rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800">
            Add event
          </Button>
        </div>
        <DialogFooter className="flex flex-col gap-3">
          <Button onClick={handleSave} className="rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-900/40 hover:shadow-2xl">
            Save events
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl text-slate-300">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
