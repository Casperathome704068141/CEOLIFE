import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getHouseholdStore, setHouseholdStore } from "../../store";
import type { Dose } from "@/lib/household/types";

export async function GET() {
  return NextResponse.json(getHouseholdStore().doses);
}

export async function POST(request: Request) {
  const body = await request.json();
  const store = getHouseholdStore();
  const { action } = body as { action?: string };

  if (action === "log") {
    const payload = body.payload as { medId: string; status: Dose["status"]; notes?: string };
    const now = new Date();
    const newDose: Dose = {
      id: randomUUID(),
      medId: payload.medId,
      scheduledAt: now.toISOString(),
      takenAt: payload.status === "taken" ? now.toISOString() : undefined,
      status: payload.status,
      notes: payload.notes,
    };
    store.doses.push(newDose);
    const medication = store.medications.find((med) => med.id === payload.medId);
    if (medication && payload.status === "taken") {
      medication.pillsOnHand = Math.max(0, medication.pillsOnHand - medication.dosage.unitsPerDose);
    }
    setHouseholdStore(store);
    return NextResponse.json(newDose, { status: 201 });
  }

  if (action === "snooze") {
    const payload = body.payload as { medId: string; minutes: number };
    const now = new Date();
    const scheduledAt = new Date(now.getTime() + payload.minutes * 60 * 1000).toISOString();
    const dose: Dose = {
      id: randomUUID(),
      medId: payload.medId,
      scheduledAt,
      status: "snoozed",
    };
    store.doses.push(dose);
    setHouseholdStore(store);
    return NextResponse.json(dose, { status: 201 });
  }

  if (action === "skip") {
    const payload = body.payload as { medId: string; reason?: string };
    const now = new Date();
    const dose: Dose = {
      id: randomUUID(),
      medId: payload.medId,
      scheduledAt: now.toISOString(),
      status: "skipped",
      notes: payload.reason,
    };
    store.doses.push(dose);
    setHouseholdStore(store);
    return NextResponse.json(dose, { status: 201 });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
