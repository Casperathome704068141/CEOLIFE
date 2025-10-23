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
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { VaultDocument } from "@/lib/vault/useVault";

const reminderOptions = [90, 60, 30, 7, 1];

interface SetExpiryDialogProps {
  doc: VaultDocument | null;
  onClose: () => void;
  onSave: (id: string, payload: { expireDate: Date | null; reminders: number[] }) => Promise<void> | void;
}

export function SetExpiryDialog({ doc, onClose, onSave }: SetExpiryDialogProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [reminders, setReminders] = useState<number[]>([]);

  useEffect(() => {
    if (doc?.expireDate) {
      setDate(new Date(doc.expireDate));
    } else {
      setDate(undefined);
    }
    setReminders([]);
  }, [doc]);

  if (!doc) return null;

  const handleSave = () => {
    onSave(doc.id, { expireDate: date ?? null, reminders });
    onClose();
  };

  return (
    <Dialog open={Boolean(doc)} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className="max-w-lg rounded-3xl border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle>Set expiry reminder</DialogTitle>
          <DialogDescription>
            Choose a secure expiry date. Beno will notify you with the reminder cadence you choose.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-2xl border border-slate-900/70 bg-slate-950/60"
          />
          <div className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold text-white">Reminder offsets</p>
            <ToggleGroup
              type="multiple"
              className="mt-2 flex flex-wrap gap-2"
              value={reminders.map(String)}
              onValueChange={(values) => setReminders(values.map((value) => Number(value)))}
            >
              {reminderOptions.map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={String(option)}
                  className="rounded-full border border-cyan-500/40 bg-slate-900/60 text-cyan-200"
                >
                  {option} days
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        <DialogFooter className="flex items-center justify-end gap-2">
          <Button variant="ghost" className="rounded-2xl" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
