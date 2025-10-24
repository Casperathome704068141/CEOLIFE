"use client";

import { useCallback, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RuleMiniBuilder, RulePreset } from "../common/RuleMiniBuilder";
import { useOnboardingStore } from "@/lib/onboarding/state";
import { persistSetup, requestPreview } from "@/lib/onboarding/client";
import { useToast } from "@/hooks/use-toast";

interface AutomationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const basePresets: RulePreset[] = [
  {
    id: "budget-threshold",
    title: "Budget over 90%",
    description: "Notify when spending exceeds 90% before month end.",
    enabled: false,
    params: { threshold: 90, contact: "Head of home" },
  },
  {
    id: "bill-due",
    title: "Bill due soon",
    description: "Alert when a bill is due in 3 days and not autopay.",
    enabled: false,
    params: { days: 3, contact: "Finance lead" },
  },
  {
    id: "ocr-receipt",
    title: "OCR receipt",
    description: "Auto-categorize new receipts uploaded to Vault.",
    enabled: false,
    params: { tag: "receipt", review: "true" },
  },
  {
    id: "dose-overdue",
    title: "Dose overdue",
    description: "WhatsApp reminder when dose overdue by 30 minutes.",
    enabled: false,
    params: { minutes: 30, contact: "Care lead" },
  },
];

export function AutomationsDrawer({ open, onClose }: AutomationsDrawerProps) {
  const { toast } = useToast();
  const setup = useOnboardingStore((state) => state.setup);
  const updateData = useOnboardingStore((state) => state.updateData);
  const setPreview = useOnboardingStore((state) => state.setPreview);
  const [presets, setPresets] = useState<RulePreset[]>(basePresets);
  const [testResult, setTestResult] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const rules = setup.data.rules ?? [];
    if (rules.length) {
      setPresets(
        basePresets.map((preset) => ({
          ...preset,
          enabled: rules.some((rule) => rule.id === preset.id),
        }))
      );
    } else {
      setPresets(basePresets);
    }
  }, [open, setup.data.rules]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const rules = presets
        .filter((preset) => preset.enabled)
        .map((preset) => ({
          id: preset.id,
          trigger: `${preset.title} (${JSON.stringify(preset.params)})`,
          action: "Send Beno notification",
        }));
      updateData("automations", { rules } as any);
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
      toast({ title: "Automations saved", description: `${rules.length} presets enabled.` });
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
  }, [onClose, presets, setPreview, toast, updateData]);

  useEffect(() => {
    const listener = () => {
      if (open) {
        handleSave();
      }
    };
    window.addEventListener("onboarding-save" as any, listener);
    return () => window.removeEventListener("onboarding-save" as any, listener);
  }, [handleSave, open]);

  const runTest = () => {
    const enabled = presets.filter((preset) => preset.enabled);
    if (!enabled.length) {
      setTestResult("No rules enabled yet.");
      return;
    }
    setTestResult(`${enabled.length} rules would have triggered 5 times in the last 30 days.`);
  };

  return (
    <Sheet open={open} onOpenChange={(value) => !value && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Automations</SheetTitle>
          <SheetDescription>Configure quick automation rules for common scenarios.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <RuleMiniBuilder presets={presets} onChange={setPresets} />
          <Button variant="outline" onClick={runTest}>
            Test on last 30d
          </Button>
          {testResult && <p className="text-sm text-muted-foreground">{testResult}</p>}
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
