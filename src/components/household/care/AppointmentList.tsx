"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Appointment } from "@/lib/household/types";

interface AppointmentListProps {
  appointments: Appointment[];
  careProfileId: string;
  onCreate: (payload: Partial<Appointment> & { careProfileId: string; title: string; start: string; end: string; location: string }) => Promise<void>;
  onNudge: (appointment: Appointment) => void;
}

export function AppointmentList({ appointments, careProfileId, onCreate, onNudge }: AppointmentListProps) {
  const [open, setOpen] = useState(false);
  const upcoming = appointments
    .filter((appt) => appt.careProfileId === careProfileId)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm text-slate-200">Appointments</CardTitle>
        <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setOpen(true)}>
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-200">
        {upcoming.length === 0 ? <p className="text-xs text-slate-500">No appointments yet.</p> : null}
        {upcoming.map((appointment) => (
          <div key={appointment.id} className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3">
            <div>
              <p className="font-medium text-slate-100">{appointment.title}</p>
              <p className="text-xs text-slate-400">
                {format(new Date(appointment.start), "MMM d, HH:mm")} • {appointment.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-xl text-xs" onClick={() => onNudge(appointment)}>
                Nudge 24h
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <AppointmentDialog
        open={open}
        onOpenChange={setOpen}
        onSave={async (payload) => {
          await onCreate({ ...payload, careProfileId });
          setOpen(false);
        }}
      />
    </Card>
  );
}

function AppointmentDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: { title: string; start: string; end: string; location: string; type?: string; notes?: string }) => Promise<void>;
}) {
  const [form, setForm] = useState({ title: "", start: "", end: "", location: "", type: "Checkup", notes: "" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border border-slate-800 bg-slate-950">
        <DialogHeader>
          <DialogTitle>Schedule appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Start</Label>
              <Input type="datetime-local" value={form.start} onChange={(event) => setForm((prev) => ({ ...prev, start: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>End</Label>
              <Input type="datetime-local" value={form.end} onChange={(event) => setForm((prev) => ({ ...prev, end: event.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea rows={3} value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              await onSave(form);
              setForm({ title: "", start: "", end: "", location: "", type: "Checkup", notes: "" });
            }}
            className="rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
