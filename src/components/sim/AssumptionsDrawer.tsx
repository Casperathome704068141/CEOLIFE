"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScenarioAssumptions } from "@/lib/sim/types";
import { Switch } from "@/components/ui/switch";

interface AssumptionsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assumptions: ScenarioAssumptions;
  onSave: (assumptions: ScenarioAssumptions, rerun: boolean) => void;
}

export function AssumptionsDrawer({ open, onOpenChange, assumptions, onSave }: AssumptionsDrawerProps) {
  const [local, setLocal] = useState<ScenarioAssumptions>(assumptions);
  const [rerun, setRerun] = useState(true);

  useEffect(() => {
    if (open) {
      setLocal(assumptions);
      setRerun(true);
    }
  }, [open, assumptions]);

  const setField = <K extends keyof ScenarioAssumptions>(key: K, value: number) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  const save = () => {
    onSave(local, rerun);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-6 bg-slate-950/95 text-slate-100">
        <SheetHeader>
          <SheetTitle>Assumptions</SheetTitle>
          <SheetDescription>Fine tune inflation, market returns, and savings behavior.</SheetDescription>
        </SheetHeader>
        <div className="space-y-6">
          <AssumptionSlider
            label="Inflation"
            value={local.inflationPct ?? 3}
            onChange={(value) => setField("inflationPct", value)}
            unit="%"
            max={12}
          />
          <AssumptionSlider
            label="Investment returns"
            value={local.returnPct ?? 4}
            onChange={(value) => setField("returnPct", value)}
            unit="%"
            max={15}
          />
          <AssumptionSlider
            label="Interest rates"
            value={local.interestRatesPct ?? 6}
            onChange={(value) => setField("interestRatesPct", value)}
            unit="%"
            max={15}
          />
          <AssumptionSlider
            label="Savings rate"
            value={local.savingsRatePct ?? 12}
            onChange={(value) => setField("savingsRatePct", value)}
            unit="%"
            max={50}
          />
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-900/60 bg-slate-900/40 px-4 py-3 text-xs text-slate-400">
          <span>Save &amp; re-run</span>
          <Switch checked={rerun} onCheckedChange={setRerun} />
        </div>
        <SheetFooter className="flex flex-col gap-3">
          <Button onClick={save} className="rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-900/40 hover:shadow-2xl">
            Save assumptions
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl text-slate-300">
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

interface AssumptionSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  max: number;
}

function AssumptionSlider({ label, value, onChange, unit, max }: AssumptionSliderProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-slate-400">{label}</Label>
      <Slider value={[value]} min={0} max={max} step={0.5} onValueChange={([val]) => onChange(val)} />
      <p className="text-xs text-slate-400">{value.toFixed(1)}{unit} assumed</p>
    </div>
  );
}
