"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useOnboardingStore } from "@/lib/onboarding/state";
import { persistSetup } from "@/lib/onboarding/client";
import { useToast } from "@/hooks/use-toast";

interface SummaryDialogProps {
  open: boolean;
  onClose: () => void;
}

const moduleLinks: Array<{ label: string; href: string }> = [
  { label: "Finance", href: "/finance" },
  { label: "Vault", href: "/vault" },
  { label: "Schedule", href: "/schedule" },
  { label: "Household", href: "/household" },
  { label: "Goals", href: "/goals" },
];

export function SummaryDialog({ open, onClose }: SummaryDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const setup = useOnboardingStore((state) => state.setup);
  const setPreview = useOnboardingStore((state) => state.setPreview);
  const setSetup = useOnboardingStore((state) => state.setSetup);
  const [enableAutomations, setEnableAutomations] = useState(true);
  const [saving, setSaving] = useState(false);

  const stats = {
    accounts: Object.keys(setup.data.integrations ?? {}).length,
    contacts: setup.data.contacts?.length ?? 0,
    docs: setup.data.docs?.length ?? 0,
    bills: setup.data.finance?.bills?.length ?? 0,
    meds: setup.data.care?.reduce((acc, profile) => acc + profile.meds.length, 0) ?? 0,
    rules: setup.data.rules?.length ?? 0,
    goals: setup.data.goals?.length ?? 0,
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const response = await persistSetup(setup, true, enableAutomations);
      setSetup(response.setup);
      setPreview({
        readiness: 100,
        financeForecast: response.setup.data.finance?.income?.map((income) => income.amount) ?? [],
        upcomingBills: response.setup.data.finance?.bills?.map((bill) => ({
          name: bill.name,
          due: `Day ${bill.dueDay}`,
          amount: bill.amount,
        })) ?? [],
        care: response.setup.data.care?.flatMap((profile) =>
          profile.meds.map((med) => ({ person: profile.name, nextDose: med.name }))
        ) ?? [],
        rules: response.setup.data.rules?.map((rule) => ({ id: rule.id, count: 1 })) ?? [],
      });
      toast({ title: "Setup complete", description: "Your launch console is ready." });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to finish",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const openModule = (href: string) => {
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ready to launch</DialogTitle>
          <DialogDescription>
            Readiness score {setup.progress}% · Review what will be created across modules.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded border border-border/60 p-3">
              <div className="font-semibold">Accounts linked</div>
              <div className="text-muted-foreground">{stats.accounts}</div>
            </div>
            <div className="rounded border border-border/60 p-3">
              <div className="font-semibold">Contacts</div>
              <div className="text-muted-foreground">{stats.contacts}</div>
            </div>
            <div className="rounded border border-border/60 p-3">
              <div className="font-semibold">Documents</div>
              <div className="text-muted-foreground">{stats.docs}</div>
            </div>
            <div className="rounded border border-border/60 p-3">
              <div className="font-semibold">Bills</div>
              <div className="text-muted-foreground">{stats.bills}</div>
            </div>
            <div className="rounded border border-border/60 p-3">
              <div className="font-semibold">Medications</div>
              <div className="text-muted-foreground">{stats.meds}</div>
            </div>
            <div className="rounded border border-border/60 p-3">
              <div className="font-semibold">Automations</div>
              <div className="text-muted-foreground">{stats.rules}</div>
            </div>
            <div className="rounded border border-border/60 p-3 md:col-span-2">
              <div className="font-semibold">Goals</div>
              <div className="text-muted-foreground">{stats.goals}</div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded border border-border/60 p-3">
            <div>
              <div className="font-semibold">Enable automations</div>
              <div className="text-xs text-muted-foreground">
                Keep toggled on to activate budget nudges and reminders.
              </div>
            </div>
            <Switch checked={enableAutomations} onCheckedChange={setEnableAutomations} />
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Open module…</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {moduleLinks.map((module) => (
                <Button key={module.href} variant="secondary" size="sm" onClick={() => openModule(module.href)}>
                  {module.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleFinish} disabled={saving}>
            Finish setup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
