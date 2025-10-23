"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Medication } from "@/lib/household/types";

interface RefillDialogProps {
  medication: Medication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { medId: string; qty: number; pharmacy?: string; pickupDate?: string }) => Promise<void>;
}

export function RefillDialog({ medication, open, onOpenChange, onSubmit }: RefillDialogProps) {
  const [form, setForm] = useState({ qty: medication?.refillPackSize ?? 30, pharmacy: "", pickupDate: "" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border border-slate-800 bg-slate-950">
        <DialogHeader>
          <DialogTitle>Log refill for {medication?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              value={form.qty}
              onChange={(event) => setForm((prev) => ({ ...prev, qty: Number(event.target.value) }))}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Pharmacy</Label>
            <Input value={form.pharmacy} onChange={(event) => setForm((prev) => ({ ...prev, pharmacy: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Pickup date</Label>
            <Input type="date" value={form.pickupDate} onChange={(event) => setForm((prev) => ({ ...prev, pickupDate: event.target.value }))} />
          </div>
          <Button
            onClick={async () => {
              if (!medication) return;
              await onSubmit({ medId: medication.id, qty: form.qty, pharmacy: form.pharmacy, pickupDate: form.pickupDate });
              onOpenChange(false);
            }}
            className="rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400"
          >
            Save refill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
