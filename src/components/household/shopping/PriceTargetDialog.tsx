"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PriceTargetDialogProps {
  itemLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (price: number | undefined) => Promise<void>;
}

export function PriceTargetDialog({ itemLabel, open, onOpenChange, onSave }: PriceTargetDialogProps) {
  const [value, setValue] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl border border-slate-800 bg-slate-950">
        <DialogHeader>
          <DialogTitle>Price target for {itemLabel}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Desired price</Label>
            <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder="E.g. 12.50" />
          </div>
          <Button
            onClick={async () => {
              const parsed = value ? Number(value) : undefined;
              await onSave(parsed);
              onOpenChange(false);
            }}
            className="rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400"
          >
            Save target
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
