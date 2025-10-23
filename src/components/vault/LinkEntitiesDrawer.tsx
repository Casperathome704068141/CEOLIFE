"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VaultDocument } from "@/lib/vault/useVault";
import { Badge } from "@/components/ui/badge";

interface LinkEntitiesDrawerProps {
  doc: VaultDocument | null;
  onClose: () => void;
  onLink: (id: string, links: VaultDocument["links"]) => Promise<void> | void;
}

export function LinkEntitiesDrawer({ doc, onClose, onLink }: LinkEntitiesDrawerProps) {
  const [links, setLinks] = useState<VaultDocument["links"]>({});

  useEffect(() => {
    if (doc?.links) {
      setLinks(doc.links);
    } else {
      setLinks({});
    }
  }, [doc]);

  if (!doc) return null;

  const handleSave = () => {
    onLink(doc.id, links);
    onClose();
  };

  return (
    <Sheet open={Boolean(doc)} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-6 bg-slate-950/95 text-slate-100">
        <SheetHeader>
          <SheetTitle>Link to other records</SheetTitle>
          <SheetDescription>
            Connect this document to bills, events, care plans, or transactions without leaving the vault.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4">
          <Field
            label="Finance bill"
            value={links?.billId ?? ""}
            placeholder="bill_123"
            helper="Shows due amount and timeline in Finance"
            onChange={(value) => setLinks((prev) => ({ ...prev, billId: value || undefined }))}
          />
          <Field
            label="Transaction"
            value={links?.txnId ?? ""}
            placeholder="txn_456"
            helper="Creates a deep link in transactions"
            onChange={(value) => setLinks((prev) => ({ ...prev, txnId: value || undefined }))}
          />
          <Field
            label="Event"
            value={links?.eventId ?? ""}
            placeholder="event_789"
            helper="Adds to household calendar"
            onChange={(value) => setLinks((prev) => ({ ...prev, eventId: value || undefined }))}
          />
          <Field
            label="Medication"
            value={links?.medId ?? ""}
            placeholder="med_321"
            helper="Pins document in Care module"
            onChange={(value) => setLinks((prev) => ({ ...prev, medId: value || undefined }))}
          />
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs text-cyan-100">
            Tips: Use “Open in …” links from the viewer to deep-link into the right module.
          </div>
        </div>
        <SheetFooter className="mt-auto flex gap-2">
          <Button variant="ghost" className="rounded-2xl" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white" onClick={handleSave}>
            Save links
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  value,
  placeholder,
  helper,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  helper: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{label}</p>
        {value ? <Badge className="rounded-full bg-cyan-500/20 text-cyan-200">Linked</Badge> : null}
      </div>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-2xl bg-slate-900/60"
      />
      <p className="text-xs text-slate-500">{helper}</p>
    </div>
  );
}
