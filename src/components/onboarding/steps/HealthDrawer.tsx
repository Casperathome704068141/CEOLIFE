"use client";

import { useCallback, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/lib/onboarding/state";
import { persistSetup, requestPreview } from "@/lib/onboarding/client";
import { useToast } from "@/hooks/use-toast";

interface HealthDrawerProps {
  open: boolean;
  onClose: () => void;
}

type MedForm = {
  name: string;
  strengthMg?: number;
  schedule: { type: "fixed" | "interval"; times?: string[]; hours?: number };
  unitsPerDose: number;
  pillsOnHand?: number;
  lowStockDays: number;
};

type CareForm = {
  name: string;
  relation: string;
  meds: MedForm[];
};

export function HealthDrawer({ open, onClose }: HealthDrawerProps) {
  const { toast } = useToast();
  const setup = useOnboardingStore((state) => state.setup);
  const updateData = useOnboardingStore((state) => state.updateData);
  const setPreview = useOnboardingStore((state) => state.setPreview);

  const [profiles, setProfiles] = useState<CareForm[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const current = setup.data.care ?? [];
    setProfiles(
      current.map((profile) => ({
        name: profile.name,
        relation: profile.relation,
        meds: profile.meds.map((med) => ({
          name: med.name,
          strengthMg: med.strengthMg,
          schedule: med.schedule,
          unitsPerDose: med.unitsPerDose,
          pillsOnHand: med.pillsOnHand,
          lowStockDays: med.lowStockDays,
        })),
      }))
    );
  }, [open, setup.data.care]);

  const createProfile = (): CareForm => ({ name: "", relation: "", meds: [] });
  const createMed = (): MedForm => ({
    name: "",
    schedule: { type: "fixed", times: ["08:00", "20:00"] },
    unitsPerDose: 1,
    lowStockDays: 7,
  });

  const updateProfile = (index: number, patch: Partial<CareForm>) => {
    setProfiles((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const updateMed = (profileIndex: number, medIndex: number, patch: Partial<MedForm>) => {
    setProfiles((prev) => {
      const next = [...prev];
      const meds = [...next[profileIndex].meds];
      meds[medIndex] = { ...meds[medIndex], ...patch };
      next[profileIndex] = { ...next[profileIndex], meds };
      return next;
    });
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      updateData("health", {
        care: profiles
          .filter((profile) => profile.name.trim())
          .map((profile) => ({
            name: profile.name,
            relation: profile.relation,
            meds: profile.meds
              .filter((med) => med.name.trim())
              .map((med) => ({
                name: med.name,
                strengthMg: med.strengthMg,
                schedule: med.schedule,
                unitsPerDose: med.unitsPerDose,
                pillsOnHand: med.pillsOnHand,
                lowStockDays: med.lowStockDays,
              })),
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
      toast({ title: "Care saved", description: "Medication plan updated." });
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
  }, [onClose, profiles, setPreview, toast, updateData]);

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
          <SheetTitle>Health & Meds</SheetTitle>
          <SheetDescription>Capture medication schedules for your household.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {profiles.map((profile, index) => (
            <div key={`profile-${index}`} className="rounded-lg border border-border/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="grid flex-1 gap-2 md:grid-cols-2">
                  <Input
                    value={profile.name}
                    placeholder="Name"
                    onChange={(event) => updateProfile(index, { name: event.target.value })}
                  />
                  <Input
                    value={profile.relation}
                    placeholder="Relation"
                    onChange={(event) => updateProfile(index, { relation: event.target.value })}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProfiles((prev) => prev.filter((_, idx) => idx !== index))}
                >
                  Remove
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {profile.meds.map((med, medIndex) => (
                  <div key={`med-${medIndex}`} className="rounded border border-border/60 p-3">
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input
                        value={med.name}
                        placeholder="Medication"
                        onChange={(event) => updateMed(index, medIndex, { name: event.target.value })}
                      />
                      <Input
                        type="number"
                        value={med.unitsPerDose}
                        onChange={(event) =>
                          updateMed(index, medIndex, { unitsPerDose: Number(event.target.value) })
                        }
                        placeholder="Units per dose"
                      />
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      <select
                        className="w-full rounded border border-border/60 bg-background px-2 py-1 text-sm"
                        value={med.schedule.type}
                        onChange={(event) =>
                          updateMed(index, medIndex, {
                            schedule:
                              event.target.value === "fixed"
                                ? { type: "fixed", times: med.schedule.times ?? ["08:00"] }
                                : { type: "interval", hours: med.schedule.hours ?? 8 },
                          })
                        }
                      >
                        <option value="fixed">Fixed times</option>
                        <option value="interval">Interval</option>
                      </select>
                      {med.schedule.type === "fixed" ? (
                        <Input
                          value={(med.schedule.times ?? []).join(", ")}
                          onChange={(event) =>
                            updateMed(index, medIndex, {
                              schedule: {
                                type: "fixed",
                                times: event.target.value
                                  .split(",")
                                  .map((time) => time.trim())
                                  .filter(Boolean),
                              },
                            })
                          }
                          placeholder="Times e.g. 08:00, 20:00"
                        />
                      ) : (
                        <Input
                          type="number"
                          value={med.schedule.hours ?? 8}
                          onChange={(event) =>
                            updateMed(index, medIndex, {
                              schedule: { type: "interval", hours: Number(event.target.value) },
                            })
                          }
                          placeholder="Interval hours"
                        />
                      )}
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      <Input
                        type="number"
                        value={med.pillsOnHand ?? 0}
                        onChange={(event) =>
                          updateMed(index, medIndex, { pillsOnHand: Number(event.target.value) })
                        }
                        placeholder="Pills on hand"
                      />
                      <Input
                        type="number"
                        value={med.lowStockDays}
                        onChange={(event) =>
                          updateMed(index, medIndex, { lowStockDays: Number(event.target.value) })
                        }
                        placeholder="Low stock days"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => updateProfile(index, { meds: [...profile.meds, createMed()] })}
                >
                  Add medication
                </Button>
              </div>
            </div>
          ))}
          {!profiles.length && (
            <p className="text-sm text-muted-foreground">
              Add a care profile to start scheduling medication reminders.
            </p>
          )}
          <Button variant="secondary" onClick={() => setProfiles((prev) => [...prev, createProfile()])}>
            Add care profile
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
