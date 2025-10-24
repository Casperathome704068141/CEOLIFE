"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import type { Member } from "@/lib/household/types";
import { useHousehold } from "@/lib/household/useHousehold";

const templates = [
  { id: "bill", label: "Bill reminder", body: (member?: Member) => `Hey ${member?.name ?? "there"}, heads up the bill is due today.` },
  { id: "shopping", label: "Shopping list", body: (member?: Member) => `Need anything else for the shared list? Check the app before 6pm.` },
  { id: "task", label: "Task", body: (member?: Member) => `Quick task: can you handle the package drop-off before noon?` },
  { id: "med", label: "Medication dose", body: (member?: Member) => `Time for medication. Log once taken so we stay on schedule.` },
  { id: "appt", label: "Appointment", body: (member?: Member) => `Reminder: appointment tomorrow. Confirm travel + prep.` },
];

interface NudgeDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NudgeDialog({ member, open, onOpenChange }: NudgeDialogProps) {
  const { sendNudge } = useHousehold();
  const { toast } = useToast();
  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [templateId, setTemplateId] = useState("bill");
  const [message, setMessage] = useState("");

  const computedMessage = useMemo(() => {
    const template = templates.find((tpl) => tpl.id === templateId);
    return template ? template.body(member ?? undefined) : "";
  }, [templateId, member]);

  const finalMessage = message || computedMessage;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl border border-slate-800 bg-slate-950 text-slate-100">
        <DialogHeader>
          <DialogTitle>Send a nudge</DialogTitle>
          <DialogDescription>WhatsApp or SMS message. Stays on this page, logged instantly.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Template</Label>
            <RadioGroup
              value={templateId}
              onValueChange={(value) => {
                setTemplateId(value);
                setMessage("");
              }}
              className="grid gap-2 md:grid-cols-2"
            >
              {templates.map((tpl) => (
                <label
                  key={tpl.id}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 hover:border-cyan-600/80"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{tpl.label}</span>
                    <span className="text-xs text-slate-400">{tpl.body(member ?? undefined)}</span>
                  </div>
                  <RadioGroupItem value={tpl.id} />
                </label>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="channel">Channel</Label>
            <RadioGroup value={channel} onValueChange={(value: "whatsapp" | "sms") => setChannel(value)} className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="whatsapp" id="whatsapp" /> WhatsApp
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="sms" id="sms" /> SMS
              </label>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">Send to</Label>
            <Input id="to" value={member?.phone ?? ""} disabled placeholder="No phone" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={4}
              value={finalMessage}
              onChange={(event) => setMessage(event.target.value)}
              className="rounded-2xl border-slate-800 bg-slate-900/50"
            />
          </div>
          <Button
            onClick={async () => {
              if (!member?.phone) {
                toast({ title: "No phone on file", description: "Add a phone number before nudging." });
                return;
              }
              await sendNudge({ channel, to: member.phone, message: finalMessage });
              toast({ title: "Nudge queued", description: `Sent via ${channel.toUpperCase()}` });
              onOpenChange(false);
            }}
            className="w-full rounded-2xl bg-cyan-500/90 text-slate-950 hover:bg-cyan-400"
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
