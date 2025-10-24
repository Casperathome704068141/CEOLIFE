"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const BRIEFING_TYPES = [
  { value: "morning", label: "Morning", description: "Cash, care, and calls before 9am" },
  { value: "evening", label: "Evening", description: "Wrap-up, nudges, and tomorrow prep" },
  { value: "weekly", label: "Weekly", description: "Ledger reconciliation + progress" },
  { value: "monthly-audit", label: "Monthly audit", description: "Full automation and risk review" },
];

export function NewBriefingDialog({
  open,
  onOpenChange,
  onRun,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRun?: (type: string) => void;
}) {
  const [type, setType] = useState("morning");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-slate-800 bg-slate-950/90">
        <DialogHeader>
          <DialogTitle className="text-slate-100">New briefing</DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Choose the cadence and Beno will synthesize finance, household, care, and goals.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup value={type} onValueChange={setType} className="space-y-3">
          {BRIEFING_TYPES.map((item) => (
            <Label
              key={item.value}
              htmlFor={`brief-${item.value}`}
              className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3 hover:border-slate-700"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
              <RadioGroupItem id={`brief-${item.value}`} value={item.value} />
            </Label>
          ))}
        </RadioGroup>
        <Button onClick={() => onRun?.(type)}>Run briefing</Button>
      </DialogContent>
    </Dialog>
  );
}
