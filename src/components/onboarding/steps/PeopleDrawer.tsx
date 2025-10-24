"use client";

import { useCallback, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineTable } from "../common/InlineTable";
import { useOnboardingStore } from "@/lib/onboarding/state";
import { persistSetup, requestPreview } from "@/lib/onboarding/client";
import { useToast } from "@/hooks/use-toast";

interface PeopleDrawerProps {
  open: boolean;
  onClose: () => void;
}

type ContactForm = {
  id: string;
  name: string;
  relation: "head" | "family" | "guest" | "vendor";
  phone?: string;
  defaultChannel: "whatsapp" | "sms" | "none";
};

const relationOptions: ContactForm["relation"][] = ["head", "family", "guest", "vendor"];

export function PeopleDrawer({ open, onClose }: PeopleDrawerProps) {
  const { toast } = useToast();
  const setup = useOnboardingStore((state) => state.setup);
  const updateData = useOnboardingStore((state) => state.updateData);
  const setPreview = useOnboardingStore((state) => state.setPreview);
  const createEmptyContact = (): ContactForm => ({
    id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    name: "",
    relation: "family",
    phone: "",
    defaultChannel: "whatsapp",
  });

  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const current = setup.data.contacts ?? [];
    setContacts(
      current.length
        ? current.map((item) => ({
            ...item,
            defaultChannel: item.defaultChannel ?? "whatsapp",
            relation: item.relation ?? "family",
          }))
        : [createEmptyContact()]
    );
  }, [open, setup.data.contacts]);

  const updateContact = (index: number, patch: Partial<ContactForm>) => {
    setContacts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const cleaned = contacts.filter((contact) => contact.name.trim().length > 0);
      updateData("people", { contacts: cleaned } as any);
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
      toast({
        title: "Contacts saved",
        description: `${cleaned.length} contact${cleaned.length === 1 ? "" : "s"} added.`,
      });
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
  }, [contacts, onClose, setPreview, toast, updateData]);

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
          <SheetTitle>Household contacts</SheetTitle>
          <SheetDescription>
            Add the people Beno should notify for reminders and nudges.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <InlineTable<ContactForm>
            data={contacts}
            onAdd={() => setContacts((prev) => [...prev, createEmptyContact()])}
            onRemove={(index) =>
              setContacts((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
            }
            emptyLabel="No contacts yet"
            columns={[
              {
                key: "name",
                label: "Name",
                render: (item, index) => (
                  <Input
                    value={item.name}
                    onChange={(event) => updateContact(index, { name: event.target.value })}
                    placeholder="Full name"
                  />
                ),
              },
              {
                key: "relation",
                label: "Relation",
                render: (item, index) => (
                  <select
                    className="w-full rounded border border-border/60 bg-background px-2 py-1 text-sm"
                    value={item.relation}
                    onChange={(event) =>
                      updateContact(index, { relation: event.target.value as ContactForm["relation"] })
                    }
                  >
                    {relationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ),
              },
              {
                key: "phone",
                label: "Phone",
                render: (item, index) => (
                  <Input
                    value={item.phone ?? ""}
                    onChange={(event) => updateContact(index, { phone: event.target.value })}
                    placeholder="Optional"
                  />
                ),
              },
              {
                key: "defaultChannel",
                label: "Channel",
                render: (item, index) => (
                  <select
                    className="w-full rounded border border-border/60 bg-background px-2 py-1 text-sm"
                    value={item.defaultChannel}
                    onChange={(event) =>
                      updateContact(index, {
                        defaultChannel: event.target.value as ContactForm["defaultChannel"],
                      })
                    }
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS</option>
                    <option value="none">None</option>
                  </select>
                ),
              },
            ]}
          />
          <Button variant="secondary" size="sm">
            Import from Google Contacts
          </Button>
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
