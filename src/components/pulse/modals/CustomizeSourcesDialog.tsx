
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Preferences } from "@/lib/pulse/types";
import { cn } from "@/lib/utils";

const providerGroups: Record<keyof Preferences["providers"], string[]> = {
  sports: ["ESPN", "TheSportsDB", "RapidAPI"],
  odds: ["TheOddsAPI", "OddsJam"],
  news: ["Reuters", "AP", "Bing News", "NewsAPI"],
  weather: ["OpenWeather"],
};

const leagueOptions = ["NBA", "NFL", "MLB", "NHL", "EPL", "UCL", "F1"];

const tzOptions = [
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Asia/Singapore",
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences?: Preferences;
  onSave: (update: Partial<Preferences>) => Promise<void> | void;
};

type Units = Preferences["units"];

export function CustomizeSourcesDialog({ open, onOpenChange, preferences, onSave }: Props) {
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState<Preferences | undefined>(preferences);

  const merged = draft ?? preferences;

  const handleToggleProvider = (group: keyof Preferences["providers"], provider: string) => {
    if (!merged) return;
    const selected = new Set(merged.providers[group]);
    if (selected.has(provider)) {
      selected.delete(provider);
    } else {
      selected.add(provider);
    }
    const next = {
      ...merged,
      providers: {
        ...merged.providers,
        [group]: Array.from(selected),
      },
    } as Preferences;
    setDraft(next);
  };

  const handleToggleLeague = (league: string) => {
    if (!merged) return;
    const selected = new Set(merged.leagues);
    if (selected.has(league)) {
      selected.delete(league);
    } else {
      selected.add(league);
    }
    setDraft({ ...merged, leagues: Array.from(selected) });
  };

  const handleUnitsChange = (units: Units) => {
    if (!merged) return;
    setDraft({ ...merged, units });
  };

  const handleTzChange = (tz: string) => {
    if (!merged) return;
    setDraft({ ...merged, tz });
  };

  const handleSave = async () => {
    if (!merged) return;
    setPending(true);
    try {
      await onSave({
        leagues: merged.leagues,
        providers: merged.providers,
        units: merged.units,
        tz: merged.tz,
      });
      setDraft(merged);
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setDraft(preferences);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customize sources</DialogTitle>
          <DialogDescription>
            Choose which providers and leagues fuel your Pulse dashboard. Changes
            sync to your preferences instantly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Providers
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {(Object.keys(providerGroups) as Array<keyof Preferences["providers"]>).map((group) => (
                <div key={group} className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm font-medium capitalize">{group}</p>
                  <div className="mt-3 space-y-3">
                    {providerGroups[group].map((provider) => {
                      const checked = merged?.providers[group]?.includes(provider) ?? false;
                      return (
                        <label key={provider} className="flex items-center justify-between text-sm">
                          <span>{provider}</span>
                          <Switch
                            checked={checked}
                            onCheckedChange={() => handleToggleProvider(group, provider)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <Separator />
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Leagues
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {leagueOptions.map((league) => {
                const active = merged?.leagues?.includes(league);
                return (
                  <button
                    key={league}
                    type="button"
                    onClick={() => handleToggleLeague(league)}
                    className={cn(
                      "rounded-full border px-4 py-1 text-sm",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted-foreground/20 text-muted-foreground"
                    )}
                  >
                    {league}
                  </button>
                );
              })}
            </div>
          </section>
          <Separator />
          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Units
              </h3>
              <div className="mt-3 space-y-2">
                {(["imperial", "metric"] as Units[]).map((option) => (
                  <label key={option} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{option}</span>
                    <Switch
                      checked={merged?.units === option}
                      onCheckedChange={() => handleUnitsChange(option)}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Time zone
              </h3>
              <div className="mt-3 space-y-2">
                {tzOptions.map((tz) => (
                  <label key={tz} className="flex items-center justify-between text-sm">
                    <span>{tz}</span>
                    <Switch
                      checked={merged?.tz === tz}
                      onCheckedChange={() => handleTzChange(tz)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </section>
          <Separator />
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Automations
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enable “auto-pin my favorite teams” to automatically track your most
              watched clubs across Pulse.
            </p>
            <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/40 p-4">
              <div>
                <p className="text-sm font-medium">Auto-pin favorite teams</p>
                <p className="text-xs text-muted-foreground">
                  Uses your existing assistant preferences to pin games as they go live.
                </p>
              </div>
              <Switch checked readOnly aria-readonly className="opacity-60" />
            </div>
          </section>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={pending || !merged}>
            {pending ? "Saving..." : "Save preferences"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
