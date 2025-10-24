"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { OAuthTile } from "../common/OAuthTile";
import { useOnboardingStore } from "@/lib/onboarding/state";
import { persistSetup, requestPreview } from "@/lib/onboarding/client";
import { useToast } from "@/hooks/use-toast";

interface AccountsDrawerProps {
  open: boolean;
  onClose: () => void;
}

type CalendarEntry = {
  provider: "google" | "outlook";
  id: string;
  name: string;
};

export function AccountsDrawer({ open, onClose }: AccountsDrawerProps) {
  const { toast } = useToast();
  const setup = useOnboardingStore((state) => state.setup);
  const updateData = useOnboardingStore((state) => state.updateData);
  const setPreview = useOnboardingStore((state) => state.setPreview);

  const [plaid, setPlaid] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [emailIngest, setEmailIngest] = useState(false);
  const [drive, setDrive] = useState(false);
  const [healthProviders, setHealthProviders] = useState<string[]>([]);
  const [historyRange, setHistoryRange] = useState("90");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const integrations = setup.data.integrations ?? {};
    setPlaid(Boolean(integrations.plaid));
    const calendars = integrations.calendars ?? [];
    setCalendarConnected(calendars.length > 0);
    setCalendarEntries(calendars as CalendarEntry[]);
    setEmailIngest(Boolean(integrations.emailIngest));
    setDrive(Boolean(integrations.drive));
    setHealthProviders(integrations.health ?? []);
  }, [open, setup.data.integrations]);

  const historyOptions = useMemo(() => ["90", "180", "365"], []);

  const toggleProvider = (provider: string) => {
    setHealthProviders((prev) =>
      prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider]
    );
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const integrations = {
        plaid,
        calendars: calendarConnected ? calendarEntries : undefined,
        emailIngest,
        drive,
        health: healthProviders,
        historyRange,
      } as any;

      updateData("accounts", { integrations } as any);
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
        title: "Accounts saved",
        description: "Integrations updated successfully.",
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
  }, [calendarConnected, calendarEntries, drive, emailIngest, healthProviders, historyRange, onClose, plaid, setPreview, toast, updateData]);

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
          <SheetTitle>Accounts & Integrations</SheetTitle>
          <SheetDescription>Link data sources to power your launch console.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold">Core integrations</h3>
            <OAuthTile
              name="Plaid banking"
              description="Securely connect bank and credit accounts."
              connected={plaid}
              onConnect={() => setPlaid(true)}
              onDisconnect={() => setPlaid(false)}
            />
            <OAuthTile
              name="Calendar sync"
              description="Import events to schedule reminders."
              connected={calendarConnected}
              onConnect={() => {
                setCalendarConnected(true);
                if (!calendarEntries.length) {
                  setCalendarEntries([
                    { provider: "google", id: "primary", name: "Primary Calendar" },
                  ]);
                }
              }}
              onDisconnect={() => {
                setCalendarConnected(false);
                setCalendarEntries([]);
              }}
            />
            {calendarConnected && (
              <div className="space-y-2 rounded-lg border border-border/60 p-3 text-xs text-muted-foreground">
                {calendarEntries.map((calendar) => (
                  <div key={calendar.id} className="flex items-center justify-between">
                    <span>{calendar.name}</span>
                    <span className="text-[10px] uppercase">{calendar.provider}</span>
                  </div>
                ))}
              </div>
            )}
            <OAuthTile
              name="Email ingest"
              description="Parse bills & receipts from a forwarding inbox."
              connected={emailIngest}
              onConnect={() => setEmailIngest(true)}
              onDisconnect={() => setEmailIngest(false)}
            />
            <OAuthTile
              name="Drive backup"
              description="Store documents in your preferred cloud drive."
              connected={drive}
              onConnect={() => setDrive(true)}
              onDisconnect={() => setDrive(false)}
            />
          </section>
          <section className="space-y-4">
            <h3 className="text-sm font-semibold">Health data sources</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {["apple", "google", "fitbit"].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => toggleProvider(provider)}
                  className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-wide ${
                    healthProviders.includes(provider)
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                      : "border-border/60 text-muted-foreground"
                  }`}
                >
                  {provider}
                </button>
              ))}
            </div>
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Historical import</h3>
            <p className="text-xs text-muted-foreground">
              Choose how much historical data to pull when linking accounts.
            </p>
            <div className="flex gap-3">
              {historyOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="history-range"
                    value={option}
                    checked={historyRange === option}
                    onChange={() => setHistoryRange(option)}
                  />
                  {option} days
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 p-3">
              <Switch id="test-connection" />
              <div>
                <Label htmlFor="test-connection" className="text-sm font-medium">
                  Test connections
                </Label>
                <p className="text-xs text-muted-foreground">
                  Run a quick status check before saving.
                </p>
              </div>
            </div>
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
