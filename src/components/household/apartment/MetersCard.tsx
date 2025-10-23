"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MeterReading } from "@/lib/household/types";

interface MetersCardProps {
  type: MeterReading["type"];
  readings: MeterReading[];
  onLog: (payload: Omit<MeterReading, "id">) => Promise<void>;
}

export function MetersCard({ type, readings, onLog }: MetersCardProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ reading: "", unit: "kWh", note: "" });

  const latest = useMemo(() => {
    return readings
      .filter((reading) => reading.type === type)
      .sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime())[0];
  }, [readings, type]);

  const history = readings
    .filter((reading) => reading.type === type)
    .sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime())
    .slice(0, 5);

  return (
    <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm text-slate-200">{type.toUpperCase()} meter</CardTitle>
        <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setOpen(true)}>
          Log reading
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-300">
        <p>Latest: {latest ? `${latest.reading} ${latest.unit}` : "No readings"}</p>
        <div className="space-y-1 text-xs text-slate-500">
          {history.map((entry) => (
            <p key={entry.id}>
              {new Date(entry.takenAt).toLocaleDateString()} — {entry.reading} {entry.unit}
            </p>
          ))}
        </div>
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-slate-800 bg-slate-950">
          <DialogHeader>
            <DialogTitle>Log {type} reading</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Reading</Label>
              <Input value={form.reading} onChange={(event) => setForm((prev) => ({ ...prev, reading: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input value={form.unit} onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Note</Label>
              <Input value={form.note} onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                await onLog({
                  apartmentId: "apt-1",
                  type,
                  reading: Number(form.reading),
                  unit: form.unit as MeterReading["unit"],
                  takenAt: new Date().toISOString(),
                  note: form.note,
                });
                setOpen(false);
                setForm({ reading: "", unit: form.unit, note: "" });
              }}
              className="rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400"
            >
              Save reading
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
