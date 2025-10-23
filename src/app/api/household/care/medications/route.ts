import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getHouseholdStore, setHouseholdStore } from "../../store";
import type { Medication } from "@/lib/household/types";

export async function GET() {
  return NextResponse.json(getHouseholdStore().medications);
}

export async function POST(request: Request) {
  const body = await request.json();
  const store = getHouseholdStore();
  const { action } = body as { action?: string };

  if (action === "upsert") {
    const payload = body.payload as Partial<Medication> & { careProfileId: string; name: string };
    const id = payload.id ?? randomUUID();
    const medication: Medication = {
      id,
      careProfileId: payload.careProfileId,
      name: payload.name,
      strengthMg: payload.strengthMg,
      form: payload.form,
      dosage: payload.dosage ?? { unitsPerDose: 1 },
      schedule: payload.schedule ?? { type: "fixed", times: ["08:00"] },
      pillsOnHand: payload.pillsOnHand ?? payload.refillPackSize ?? 30,
      refillPackSize: payload.refillPackSize ?? 30,
      lowStockThreshold: payload.lowStockThreshold ?? 5,
      refillsRemaining: payload.refillsRemaining ?? 0,
      alerts: payload.alerts,
      linkedDocs: payload.linkedDocs ?? [],
    };

    const existingIndex = store.medications.findIndex((med) => med.id === id);
    if (existingIndex >= 0) {
      store.medications[existingIndex] = { ...store.medications[existingIndex], ...medication };
    } else {
      store.medications.push(medication);
    }
    setHouseholdStore(store);
    return NextResponse.json(medication, { status: existingIndex >= 0 ? 200 : 201 });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
