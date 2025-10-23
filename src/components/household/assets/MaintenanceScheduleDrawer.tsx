"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/lib/household/types";

interface MaintenanceScheduleDrawerProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: { assetId: string; next: string; cadenceDays?: number }) => Promise<void>;
  onMarkServiced: (payload: { assetId: string; note?: string }) => Promise<void>;
}

export function MaintenanceScheduleDrawer({ asset, open, onOpenChange, onSave, onMarkServiced }: MaintenanceScheduleDrawerProps) {
  const [form, setForm] = useState({ next: asset?.maintenance?.next?.slice(0, 10) ?? "", cadence: asset?.maintenance?.cadenceDays?.toString() ?? "90", note: "" });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md border-l border-slate-800 bg-slate-950 text-slate-100">
        <SheetHeader>
          <SheetTitle>Maintenance for {asset?.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>Next service</Label>
            <Input type="date" value={form.next} onChange={(event) => setForm((prev) => ({ ...prev, next: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Cadence (days)</Label>
            <Input value={form.cadence} onChange={(event) => setForm((prev) => ({ ...prev, cadence: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Note</Label>
            <Input value={form.note} onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))} placeholder="Filter change, tune-up, etc." />
          </div>
          <div className="grid gap-2">
            <Button
              onClick={async () => {
                if (!asset) return;
                await onSave({ assetId: asset.id, next: new Date(form.next).toISOString(), cadenceDays: Number(form.cadence) });
                onOpenChange(false);
              }}
              className="rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400"
            >
              Save schedule
            </Button>
            <Button
              variant="secondary"
              className="rounded-2xl"
              onClick={async () => {
                if (!asset) return;
                await onMarkServiced({ assetId: asset.id, note: form.note });
                onOpenChange(false);
              }}
            >
              Mark serviced today
            </Button>
          </div>
          {asset?.maintenance?.history?.length ? (
            <div className="space-y-2 rounded-2xl bg-slate-900/60 p-3 text-xs text-slate-400">
              <p className="font-medium text-slate-200">History</p>
              {asset.maintenance.history.map((entry, index) => (
                <div key={index} className="flex justify-between">
                  <span>{new Date(entry.performedAt).toLocaleDateString()}</span>
                  <span>{entry.note ?? "Serviced"}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
