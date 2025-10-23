"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useHousehold } from "@/lib/household/useHousehold";
import type { CareProfile, Medication, Member } from "@/lib/household/types";
import { MedicationCard } from "./MedicationCard";
import { MedicationEditor } from "./MedicationEditor";
import { RefillDialog } from "./RefillDialog";
import { AppointmentList } from "./AppointmentList";
import { EmergencyCard } from "./EmergencyCard";
import { NudgeDialog } from "../NudgeDialog";

export function CareProfiles() {
  const {
    careProfiles,
    medications,
    doses,
    appointments,
    members,
    careKpis,
    logDose,
    snoozeDose,
    skipDose,
    refillMedication,
    upsertMedication,
    addAppointment,
  } = useHousehold();
  const { toast } = useToast();

  const [editing, setEditing] = useState<{ careProfile: CareProfile; medication?: Medication | null } | null>(null);
  const [refillMed, setRefillMed] = useState<Medication | null>(null);
  const [nudgeTarget, setNudgeTarget] = useState<Member | null>(null);

  useEffect(() => {
    const handleAdd = () => {
      if (careProfiles[0]) {
        setEditing({ careProfile: careProfiles[0], medication: null });
      }
    };
    const handleNudge = () => {
      if (careProfiles[0]) {
        const member = members.find((mem) => mem.id === careProfiles[0].memberId);
        if (member) {
          setNudgeTarget(member);
        }
      }
    };
    window.addEventListener("household:add-medication", handleAdd);
    window.addEventListener("household:nudge-care", handleNudge);
    return () => {
      window.removeEventListener("household:add-medication", handleAdd);
      window.removeEventListener("household:nudge-care", handleNudge);
    };
  }, [careProfiles, members]);

  const medsByProfile = useMemo(() => {
    const map = new Map<string, Medication[]>();
    medications.forEach((med) => {
      const list = map.get(med.careProfileId) ?? [];
      list.push(med);
      map.set(med.careProfileId, list);
    });
    return map;
  }, [medications]);

  return (
    <div className="space-y-6">
      <KpiRow
        adherence={careKpis.adherence30d}
        onHandDays={careKpis.onHandDays}
        nextRefill={careKpis.nextRefillDate ? format(new Date(careKpis.nextRefillDate), "MMM d") : "—"}
        nextAppointment={careKpis.nextAppointmentDate ? format(new Date(careKpis.nextAppointmentDate), "MMM d") : "—"}
      />

      <div className="space-y-6">
        {careProfiles.map((profile) => {
          const member = members.find((mem) => mem.id === profile.memberId);
          const meds = medsByProfile.get(profile.id) ?? [];
          return (
            <Card key={profile.id} className="rounded-3xl border border-slate-900/60 bg-slate-950/80">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-50">{profile.name}</CardTitle>
                  <p className="text-xs text-slate-400">{member ? `Linked to ${member.name}` : "Standalone profile"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-xl border-slate-700 text-xs text-slate-300">
                    {profile.flags?.phi ? "PHI Locked" : "General"}
                  </Badge>
                  <Button variant="ghost" className="rounded-xl text-xs" onClick={() => setEditing({ careProfile: profile, medication: null })}>
                    Add medication
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                  <div className="space-y-4">
                    {meds.length === 0 ? <p className="text-sm text-slate-500">No medications yet.</p> : null}
                    {meds.map((medication) => (
                      <MedicationCard
                        key={medication.id}
                        medication={medication}
                        doses={doses}
                        onTaken={async () => {
                          await logDose({ medId: medication.id, status: "taken" });
                          toast({ title: "Dose logged", description: `${medication.name} taken` });
                        }}
                        onSnooze={async () => {
                          await snoozeDose({ medId: medication.id, minutes: 15 });
                          toast({ title: "Snoozed", description: "Will remind again in 15 minutes" });
                        }}
                        onSkip={async () => {
                          const reason = typeof window !== "undefined" ? window.prompt("Reason for skipping?") ?? undefined : undefined;
                          await skipDose({ medId: medication.id, reason });
                          toast({ title: "Marked skipped", description: reason ?? "No reason provided" });
                          if (reason && reason.toLowerCase().includes("stock")) {
                            setRefillMed(medication);
                          }
                        }}
                        onRefill={() => setRefillMed(medication)}
                        onEdit={() => setEditing({ careProfile: profile, medication })}
                        onNudge={() => member && setNudgeTarget(member)}
                      />
                    ))}
                  </div>
                  <div className="space-y-4">
                    <AppointmentList
                      appointments={appointments}
                      careProfileId={profile.id}
                      onCreate={async (payload) => {
                        await addAppointment(payload);
                        toast({ title: "Appointment added", description: payload.title });
                      }}
                      onNudge={(appointment) => member && setNudgeTarget(member)}
                    />
                    <EmergencyCard
                      profileName={profile.name}
                      emergencyContact={member?.phone}
                      onShare={() => member && setNudgeTarget(member)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {editing ? (
        <MedicationEditor
          careProfileId={editing.careProfile.id}
          medication={editing.medication}
          onSubmit={async (payload) => {
            await upsertMedication({ ...payload, careProfileId: editing.careProfile.id });
            toast({ title: editing.medication ? "Medication updated" : "Medication added", description: payload.name });
          }}
          onClose={() => setEditing(null)}
        />
      ) : null}

      <RefillDialog
        medication={refillMed}
        open={!!refillMed}
        onOpenChange={(value) => !value && setRefillMed(null)}
        onSubmit={async (payload) => {
          await refillMedication(payload);
          toast({ title: "Refill logged", description: `${payload.qty} pills added` });
        }}
      />

      <NudgeDialog member={nudgeTarget} open={!!nudgeTarget} onOpenChange={(value) => !value && setNudgeTarget(null)} />
    </div>
  );
}

function KpiRow({ adherence, onHandDays, nextRefill, nextAppointment }: { adherence: number; onHandDays: number; nextRefill: string; nextAppointment: string }) {
  const items = [
    { label: "Adherence 30d", value: `${adherence}%`, tone: "text-emerald-300" },
    { label: "On-hand days", value: onHandDays.toString(), tone: "text-cyan-300" },
    { label: "Next refill", value: nextRefill, tone: "text-amber-300" },
    { label: "Next appointment", value: nextAppointment, tone: "text-slate-200" },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="rounded-3xl border border-slate-900/60 bg-slate-950/80">
          <CardContent className="space-y-2 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">{item.label}</p>
            <p className={`text-2xl font-semibold ${item.tone}`}>{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
