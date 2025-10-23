"use client";

import { useState } from "react";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SettleNowDialogProps {
  onSubmit: (payload: { settlements: { payer: string; amount: number }[] }) => Promise<void>;
  onClose: () => void;
}

export function SettleNowDialog({ onSubmit, onClose }: SettleNowDialogProps) {
  const [rows, setRows] = useState([{ payer: "", amount: "" }]);

  return (
    <DialogContent className="max-w-lg rounded-3xl border border-slate-800 bg-slate-950">
      <DialogHeader>
        <DialogTitle>Settle now</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="flex gap-2">
            <Input value={row.payer} onChange={(event) => setRows((prev) => prev.map((item, idx) => (idx === index ? { ...item, payer: event.target.value } : item)))} placeholder="Payer" />
            <Input value={row.amount} onChange={(event) => setRows((prev) => prev.map((item, idx) => (idx === index ? { ...item, amount: event.target.value } : item)))} placeholder="Amount" />
          </div>
        ))}
        <Button variant="ghost" className="rounded-2xl" onClick={() => setRows((prev) => [...prev, { payer: "", amount: "" }])}>
          Add party
        </Button>
      </div>
      <DialogFooter>
        <Button
          onClick={async () => {
            await onSubmit({
              settlements: rows.map((row) => ({ payer: row.payer, amount: Number(row.amount) })),
            });
            onClose();
          }}
          className="rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400"
        >
          Settle
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
