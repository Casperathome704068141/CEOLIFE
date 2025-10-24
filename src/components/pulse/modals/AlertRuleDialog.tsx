"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AlertDraft {
  valueScore: number;
  lineMove: number;
  windowHours: number;
  pregameMinutes: number;
  channel: "in-app" | "push" | "sms";
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: { id: string; label: string; league: string };
  onSave: (payload: AlertDraft) => Promise<void> | void;
};

const defaultDraft: AlertDraft = {
  valueScore: 7,
  lineMove: 1,
  windowHours: 6,
  pregameMinutes: 30,
  channel: "in-app",
};

export function AlertRuleDialog({ open, onOpenChange, context, onSave }: Props) {
  const [draft, setDraft] = useState<AlertDraft>(defaultDraft);
  const [pending, setPending] = useState(false);

  const reset = () => setDraft(defaultDraft);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          reset();
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Set alert</DialogTitle>
          <DialogDescription>
            Trigger rules when value spikes, lines move quickly or games near kickoff.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {context ? (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <p className="font-semibold">{context.label}</p>
              <p className="text-muted-foreground">{context.league}</p>
            </div>
          ) : null}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="valueScore">Value score ≥</Label>
              <Input
                id="valueScore"
                type="number"
                min={0}
                max={10}
                value={draft.valueScore}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, valueScore: Number(event.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lineMove">Line move ≥ σ</Label>
              <Input
                id="lineMove"
                type="number"
                step="0.1"
                value={draft.lineMove}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, lineMove: Number(event.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="windowHours">Window (hours)</Label>
              <Input
                id="windowHours"
                type="number"
                min={1}
                value={draft.windowHours}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, windowHours: Number(event.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pregame">Notify before start (minutes)</Label>
              <Input
                id="pregame"
                type="number"
                min={0}
                value={draft.pregameMinutes}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, pregameMinutes: Number(event.target.value) }))
                }
              />
            </div>
          </section>
          <Separator />
          <section className="space-y-2">
            <Label>Channel</Label>
            <div className="flex gap-2">
              {(
                [
                  { id: "in-app", label: "In-app" },
                  { id: "push", label: "PWA push" },
                  { id: "sms", label: "WhatsApp/SMS" },
                ] as const
              ).map((option) => (
                <Button
                  key={option.id}
                  type="button"
                  variant={draft.channel === option.id ? "default" : "outline"}
                  onClick={() => setDraft((prev) => ({ ...prev, channel: option.id }))}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </section>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={pending}
            onClick={async () => {
              setPending(true);
              try {
                await onSave(draft);
                reset();
                onOpenChange(false);
              } finally {
                setPending(false);
              }
            }}
          >
            {pending ? "Saving..." : "Save alert"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
