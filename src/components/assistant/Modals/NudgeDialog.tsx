"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function NudgeDialog({
  open,
  onOpenChange,
  onSend,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend?: (payload: { contact: string; message: string; channel: "sms" | "whatsapp"; quietHours: boolean }) => void;
}) {
  const [contact, setContact] = useState("Marcus");
  const [message, setMessage] = useState("Need anything before I submit rent? Receipt ready to share.");
  const [channel, setChannel] = useState<"sms" | "whatsapp">("whatsapp");
  const [quiet, setQuiet] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-slate-800 bg-slate-950/90">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Send nudge</DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Nudges respect privacy controls. Attachments auto-mask PHI when enabled.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wide text-slate-400">Contact</Label>
          <Input value={contact} onChange={(event) => setContact(event.target.value)} className="bg-slate-900/70" />
          <Label className="text-xs uppercase tracking-wide text-slate-400">Channel</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={channel === "whatsapp" ? "default" : "secondary"}
              onClick={() => setChannel("whatsapp")}
            >
              WhatsApp
            </Button>
            <Button size="sm" variant={channel === "sms" ? "default" : "secondary"} onClick={() => setChannel("sms")}>
              SMS
            </Button>
          </div>
          <Label className="text-xs uppercase tracking-wide text-slate-400">Message</Label>
          <Textarea value={message} onChange={(event) => setMessage(event.target.value)} className="bg-slate-900/70" />
          <div className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3">
            <div>
              <p className="text-sm text-slate-200">Bypass quiet hours</p>
              <p className="text-xs text-slate-400">Urgent updates still respect privacy masking</p>
            </div>
            <Switch checked={quiet} onCheckedChange={setQuiet} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSend?.({ contact, message, channel, quietHours: quiet })}>Send nudge</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
