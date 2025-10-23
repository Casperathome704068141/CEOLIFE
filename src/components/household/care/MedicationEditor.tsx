"use client";

import { useEffect, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Medication } from "@/lib/household/types";

interface MedicationEditorProps {
  careProfileId: string;
  medication?: Medication | null;
  onSubmit: (payload: Partial<Medication> & { careProfileId: string; name: string }) => Promise<void>;
  onClose: () => void;
}

export function MedicationEditor({ careProfileId, medication, onSubmit, onClose }: MedicationEditorProps) {
  const [form, setForm] = useState({
    name: medication?.name ?? "",
    strengthMg: medication?.strengthMg?.toString() ?? "",
    form: medication?.form ?? "tab",
    unitsPerDose: medication?.dosage.unitsPerDose ?? 1,
    scheduleType: medication?.schedule.type ?? "fixed",
    times: medication?.schedule.times?.join(",") ?? "08:00,20:00",
    intervalHours: medication?.schedule.intervalHours?.toString() ?? "",
    pillsOnHand: medication?.pillsOnHand.toString() ?? "30",
    refillPackSize: medication?.refillPackSize.toString() ?? "30",
    lowStockThreshold: medication?.lowStockThreshold.toString() ?? "5",
  });

  useEffect(() => {
    if (medication) {
      setForm({
        name: medication.name,
        strengthMg: medication.strengthMg?.toString() ?? "",
        form: medication.form ?? "tab",
        unitsPerDose: medication.dosage.unitsPerDose,
        scheduleType: medication.schedule.type,
        times: medication.schedule.times?.join(",") ?? "08:00,20:00",
        intervalHours: medication.schedule.intervalHours?.toString() ?? "",
        pillsOnHand: medication.pillsOnHand.toString(),
        refillPackSize: medication.refillPackSize.toString(),
        lowStockThreshold: medication.lowStockThreshold.toString(),
      });
    }
  }, [medication]);

  return (
    <DialogContent className="max-w-lg rounded-3xl border border-slate-800 bg-slate-950">
      <DialogHeader>
        <DialogTitle>{medication ? "Edit medication" : "Add medication"}</DialogTitle>
      </DialogHeader>
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const times = form.scheduleType === "fixed" ? form.times.split(",").map((time) => time.trim()).filter(Boolean) : undefined;
          const intervalHours = form.scheduleType === "interval" ? Number(form.intervalHours) || undefined : undefined;
          await onSubmit({
            id: medication?.id,
            careProfileId,
            name: form.name,
            strengthMg: form.strengthMg ? Number(form.strengthMg) : undefined,
            form: form.form as Medication["form"],
            dosage: { unitsPerDose: Number(form.unitsPerDose) || 1 },
            schedule: {
              type: form.scheduleType as Medication["schedule"]["type"],
              times,
              intervalHours,
            },
            pillsOnHand: Number(form.pillsOnHand) || 0,
            refillPackSize: Number(form.refillPackSize) || 30,
            lowStockThreshold: Number(form.lowStockThreshold) || 5,
          });
          onClose();
        }}
      >
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Strength (mg)</Label>
            <Input value={form.strengthMg} onChange={(event) => setForm((prev) => ({ ...prev, strengthMg: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Form</Label>
            <Select value={form.form} onValueChange={(value) => setForm((prev) => ({ ...prev, form: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tab">Tablet</SelectItem>
                <SelectItem value="cap">Capsule</SelectItem>
                <SelectItem value="liq">Liquid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Units per dose</Label>
          <Input
            type="number"
            min={1}
            value={form.unitsPerDose}
            onChange={(event) => setForm((prev) => ({ ...prev, unitsPerDose: Number(event.target.value) }))}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Schedule type</Label>
            <Select value={form.scheduleType} onValueChange={(value) => setForm((prev) => ({ ...prev, scheduleType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed times</SelectItem>
                <SelectItem value="interval">Interval</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.scheduleType === "fixed" ? (
            <div className="space-y-2">
              <Label>Times (comma separated)</Label>
              <Input value={form.times} onChange={(event) => setForm((prev) => ({ ...prev, times: event.target.value }))} />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Interval hours</Label>
              <Input value={form.intervalHours} onChange={(event) => setForm((prev) => ({ ...prev, intervalHours: event.target.value }))} />
            </div>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Pills on hand</Label>
            <Input value={form.pillsOnHand} onChange={(event) => setForm((prev) => ({ ...prev, pillsOnHand: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Refill pack size</Label>
            <Input value={form.refillPackSize} onChange={(event) => setForm((prev) => ({ ...prev, refillPackSize: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Low stock threshold</Label>
            <Input value={form.lowStockThreshold} onChange={(event) => setForm((prev) => ({ ...prev, lowStockThreshold: event.target.value }))} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 rounded-2xl bg-cyan-500/90 text-slate-950 hover:bg-cyan-400">
            Save
          </Button>
          <Button type="button" variant="ghost" className="flex-1 rounded-2xl" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
