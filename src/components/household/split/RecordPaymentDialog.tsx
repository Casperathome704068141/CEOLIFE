"use client";

import { useState } from "react";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Settlement } from "@/lib/household/types";

interface RecordPaymentDialogProps {
  onSubmit: (payload: { payer: string; amount: number; method: Settlement["method"]; reference?: string }) => Promise<void>;
  onClose: () => void;
}

export function RecordPaymentDialog({ onSubmit, onClose }: RecordPaymentDialogProps) {
  const [form, setForm] = useState({ payer: "", amount: "", method: "etransfer" as Settlement["method"], reference: "" });

  return (
    <DialogContent className="max-w-md rounded-3xl border border-slate-800 bg-slate-950">
      <DialogHeader>
        <DialogTitle>Record payment</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Payer</Label>
          <Input value={form.payer} onChange={(event) => setForm((prev) => ({ ...prev, payer: event.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input value={form.amount} onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Method</Label>
          <Input value={form.method} onChange={(event) => setForm((prev) => ({ ...prev, method: event.target.value as Settlement["method"] }))} />
        </div>
        <div className="space-y-2">
          <Label>Reference</Label>
          <Input value={form.reference} onChange={(event) => setForm((prev) => ({ ...prev, reference: event.target.value }))} />
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={async () => {
            await onSubmit({ payer: form.payer, amount: Number(form.amount), method: form.method, reference: form.reference });
            onClose();
          }}
          className="rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400"
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
