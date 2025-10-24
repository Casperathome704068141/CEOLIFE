"use client";

import { useCallback, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { InlineTable } from "../common/InlineTable";
import { useOnboardingStore } from "@/lib/onboarding/state";
import { persistSetup, requestPreview } from "@/lib/onboarding/client";
import { useToast } from "@/hooks/use-toast";

interface HouseholdDrawerProps {
  open: boolean;
  onClose: () => void;
}

type AssetForm = {
  id: string;
  label: string;
  category: "appliance" | "electronics" | "vehicle" | "furniture" | "other";
  serial?: string;
  warrantyEnd: string | null;
};

const utilityOptions = ["internet", "electricity", "water", "gas"] as const;
const assetCategories: AssetForm["category"][] = [
  "appliance",
  "electronics",
  "vehicle",
  "furniture",
  "other",
];

export function HouseholdDrawer({ open, onClose }: HouseholdDrawerProps) {
  const { toast } = useToast();
  const setup = useOnboardingStore((state) => state.setup);
  const updateData = useOnboardingStore((state) => state.updateData);
  const setPreview = useOnboardingStore((state) => state.setPreview);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [utilities, setUtilities] = useState<string[]>([]);
  const [assets, setAssets] = useState<AssetForm[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const household = setup.data.household;
    setName(household?.name ?? "");
    setAddress(household?.address ?? "");
    setUtilities(household?.utilities ?? []);
    setAssets(
      household?.assets?.map((asset) => ({
        id: asset.id,
        label: asset.label,
        category: asset.category,
        serial: asset.serial,
        warrantyEnd: asset.warrantyEnd ?? null,
      })) ?? []
    );
  }, [open, setup.data.household]);

  const toggleUtility = (value: string) => {
    setUtilities((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const createEmptyAsset = (): AssetForm => ({
    id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    label: "",
    category: "appliance",
    serial: "",
    warrantyEnd: null,
  });

  const updateAsset = (index: number, patch: Partial<AssetForm>) => {
    setAssets((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      updateData("household", {
        household: {
          name,
          address,
          utilities,
          assets: assets.filter((asset) => asset.label.trim()).map((asset) => ({
            id: asset.id,
            label: asset.label,
            category: asset.category,
            serial: asset.serial,
            warrantyEnd: asset.warrantyEnd,
          })),
        },
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
      toast({ title: "Household saved", description: "Household profile updated." });
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
  }, [address, assets, name, onClose, setPreview, toast, updateData, utilities]);

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
          <SheetTitle>Household</SheetTitle>
          <SheetDescription>Define your household profile and utilities.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Household name" />
            <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Address (optional)" />
          </div>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Utilities</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {utilityOptions.map((utility) => (
                <label key={utility} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={utilities.includes(utility)}
                    onCheckedChange={() => toggleUtility(utility)}
                    id={`utility-${utility}`}
                  />
                  {utility}
                </label>
              ))}
            </div>
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Assets</h3>
            <InlineTable<AssetForm>
              data={assets}
              onAdd={() => setAssets((prev) => [...prev, createEmptyAsset()])}
              onRemove={(index) => setAssets((prev) => prev.filter((_, idx) => idx !== index))}
              columns={[
                {
                  key: "label",
                  label: "Label",
                  render: (item, index) => (
                    <Input
                      value={item.label}
                      onChange={(event) => updateAsset(index, { label: event.target.value })}
                    />
                  ),
                },
                {
                  key: "category",
                  label: "Category",
                  render: (item, index) => (
                    <select
                      className="w-full rounded border border-border/60 bg-background px-2 py-1 text-sm"
                      value={item.category}
                      onChange={(event) =>
                        updateAsset(index, { category: event.target.value as AssetForm["category"] })
                      }
                    >
                      {assetCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  ),
                },
                {
                  key: "serial",
                  label: "Serial",
                  render: (item, index) => (
                    <Input
                      value={item.serial ?? ""}
                      onChange={(event) => updateAsset(index, { serial: event.target.value })}
                    />
                  ),
                },
                {
                  key: "warrantyEnd",
                  label: "Warranty end",
                  render: (item, index) => (
                    <Input
                      type="date"
                      value={item.warrantyEnd ?? ""}
                      onChange={(event) => updateAsset(index, { warrantyEnd: event.target.value || null })}
                    />
                  ),
                },
              ]}
            />
          </section>
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
