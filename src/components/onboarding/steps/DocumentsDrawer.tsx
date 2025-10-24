"use client";

import { useCallback, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileDrop } from "../common/FileDrop";
import { useOnboardingStore } from "@/lib/onboarding/state";
import { persistSetup, requestPreview } from "@/lib/onboarding/client";
import { useToast } from "@/hooks/use-toast";

interface DocumentsDrawerProps {
  open: boolean;
  onClose: () => void;
}

type DocType = "id" | "policy" | "contract" | "receipt" | "medical" | "other";

type DocumentForm = {
  id: string;
  filename: string;
  type: DocType;
  expiresAt: string | null;
  tags: string[];
};

const docTypes: DocType[] = ["id", "policy", "contract", "receipt", "medical", "other"];

export function DocumentsDrawer({ open, onClose }: DocumentsDrawerProps) {
  const { toast } = useToast();
  const setup = useOnboardingStore((state) => state.setup);
  const updateData = useOnboardingStore((state) => state.updateData);
  const setPreview = useOnboardingStore((state) => state.setPreview);
  const [docs, setDocs] = useState<DocumentForm[]>([]);
  const [notes, setNotes] = useState("Suggested reminders: 24w, 8w, 2w before expiry.");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const current = setup.data.docs ?? [];
    setDocs(
      current.map((doc) => ({
        id: doc.id,
        filename: doc.filename,
        type: doc.type,
        expiresAt: doc.expiresAt ?? null,
        tags: doc.tags ?? [],
      }))
    );
  }, [open, setup.data.docs]);

  const handleFiles = (files: File[]) => {
    setDocs((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
        filename: file.name,
        type: "receipt" as DocType,
        expiresAt: null,
        tags: [],
      })),
    ]);
  };

  const updateDoc = (index: number, patch: Partial<DocumentForm>) => {
    setDocs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      updateData("documents", {
        docs: docs.map((doc) => ({
          id: doc.id,
          filename: doc.filename,
          type: doc.type,
          expiresAt: doc.expiresAt,
          tags: doc.tags,
        })),
      } as any);
      const latest = useOnboardingStore.getState().setup;
      const response = await persistSetup(latest, false);
      const preview = await requestPreview(response.setup);
      setPreview({
        readiness: preview.readiness,
        financeForecast: preview.finance?.forecast ?? [],
        upcomingBills: preview.finance?.bills ?? [],
        care: preview.care ?? [],
        rules: preview.rules ?? [],
      });
      toast({ title: "Documents saved", description: `${docs.length} files staged.` });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [docs, onClose, setPreview, toast, updateData]);

  useEffect(() => {
    const listener = () => {
      if (open) {
        handleSave();
      }
    };
    window.addEventListener("onboarding-save" as any, listener);
    return () => window.removeEventListener("onboarding-save" as any, listener);
  }, [handleSave, open]);

  return (
    <Sheet open={open} onOpenChange={(value) => !value && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Documents</SheetTitle>
          <SheetDescription>Upload receipts or IDs to preview CDR and reminders.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <FileDrop onFiles={handleFiles} />
          <div className="space-y-4">
            {docs.map((doc, index) => (
              <div key={doc.id} className="rounded-lg border border-border/70 p-4">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{doc.filename}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDocs((prev) => prev.filter((_, idx) => idx !== index))}
                  >
                    Remove
                  </Button>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className="space-y-1 text-xs uppercase text-muted-foreground">
                    Type
                    <select
                      className="w-full rounded border border-border/60 bg-background px-2 py-2 text-sm"
                      value={doc.type}
                      onChange={(event) => updateDoc(index, { type: event.target.value as DocType })}
                    >
                      {docTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-xs uppercase text-muted-foreground">
                    Expiry
                    <Input
                      type="date"
                      value={doc.expiresAt ?? ""}
                      onChange={(event) => updateDoc(index, { expiresAt: event.target.value || null })}
                    />
                  </label>
                </div>
                <div className="mt-3 space-y-1 text-xs uppercase text-muted-foreground">
                  Tags
                  <Input
                    placeholder="Comma separated tags"
                    value={doc.tags.join(", ")}
                    onChange={(event) =>
                      updateDoc(index, {
                        tags: event.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              </div>
            ))}
            {!docs.length && (
              <p className="text-sm text-muted-foreground">
                Upload files to populate automations and reminder drafts.
              </p>
            )}
          </div>
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
        </div>
        <SheetFooter className="mt-8">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Discard
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            Save & close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
