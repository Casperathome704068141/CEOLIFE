"use client";

import { useState } from "react";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Ticket } from "@/lib/household/types";

interface TicketEditorProps {
  onSubmit: (payload: Partial<Ticket> & { apartmentId: string; title: string; type: Ticket["type"]; severity: Ticket["severity"] }) => Promise<void>;
  onClose: () => void;
}

export function TicketEditor({ onSubmit, onClose }: TicketEditorProps) {
  const [form, setForm] = useState({
    title: "",
    type: "repair" as Ticket["type"],
    severity: "med" as Ticket["severity"],
    due: "",
    notes: "",
  });

  return (
    <DialogContent className="max-w-lg rounded-3xl border border-slate-800 bg-slate-950">
      <DialogHeader>
        <DialogTitle>New ticket</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(value: Ticket["type"]) => setForm((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="improvement">Improvement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Severity</Label>
            <Select value={form.severity} onValueChange={(value: Ticket["severity"]) => setForm((prev) => ({ ...prev, severity: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="med">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Due</Label>
          <Input type="date" value={form.due} onChange={(event) => setForm((prev) => ({ ...prev, due: event.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea rows={3} value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} />
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={async () => {
            await onSubmit({
              apartmentId: "apt-1",
              title: form.title,
              type: form.type,
              severity: form.severity,
              due: form.due ? new Date(form.due).toISOString() : undefined,
              notes: form.notes,
            });
            onClose();
          }}
          className="rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400"
        >
          Save ticket
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
