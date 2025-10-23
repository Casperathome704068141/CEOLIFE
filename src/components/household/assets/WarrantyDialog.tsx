"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/lib/household/types";

interface WarrantyDialogProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: { assetId: string; warrantyEnd: string; reminderDays?: number[] }) => Promise<void>;
}

export function WarrantyDialog({ asset, open, onOpenChange, onSave }: WarrantyDialogProps) {
  const [form, setForm] = useState({ date: asset?.warrantyEnd?.slice(0, 10) ?? "", reminders: "30" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border border-slate-800 bg-slate-950">
        <DialogHeader>
          <DialogTitle>Warranty for {asset?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Warranty end</Label>
            <Input type="date" value={form.date} onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Reminder days (comma separated)</Label>
            <Input value={form.reminders} onChange={(event) => setForm((prev) => ({ ...prev, reminders: event.target.value }))} />
          </div>
          <Button
            onClick={async () => {
              if (!asset) return;
              const reminderDays = form.reminders
                .split(",")
                .map((value) => Number(value.trim()))
                .filter((value) => !Number.isNaN(value));
              await onSave({ assetId: asset.id, warrantyEnd: new Date(form.date).toISOString(), reminderDays });
              onOpenChange(false);
            }}
            className="rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400"
          >
            Save warranty
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
