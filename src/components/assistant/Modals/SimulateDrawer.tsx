"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SimulateDrawer({
  open,
  onOpenChange,
  context,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: string;
  onApply?: (note: string) => void;
}) {
  const [notes, setNotes] = useState(context ?? "Rent +12% starting January");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full border-l border-slate-800 bg-slate-950/95 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-slate-100">Simulate scenario</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <Field label="Scenario">
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="bg-slate-900/70" />
          </Field>
          <Card className="border-slate-800/70 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-sm text-slate-200">Forecast impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-300">
              <p>• Runway shifts from 7.5 → 6.1 months.</p>
              <p>• Recommend reallocating $450 from travel goal.</p>
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onApply?.(notes)}>Apply plan</Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
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
