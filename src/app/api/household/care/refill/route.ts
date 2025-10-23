import { NextResponse } from "next/server";
import { getHouseholdStore, setHouseholdStore } from "../../store";

export async function POST(request: Request) {
  const { medId, qty, pharmacy, pickupDate } = (await request.json()) as {
    medId: string;
    qty: number;
    pharmacy?: string;
    pickupDate?: string;
  };
  const store = getHouseholdStore();
  const medication = store.medications.find((med) => med.id === medId);
  if (!medication) {
    return NextResponse.json({ error: "Medication not found" }, { status: 404 });
  }
  medication.pillsOnHand += qty;
  if (typeof medication.refillsRemaining === "number" && medication.refillsRemaining > 0) {
    medication.refillsRemaining = Math.max(0, medication.refillsRemaining - 1);
  }
  medication.notes = [
    pharmacy ? `Refill at ${pharmacy}` : undefined,
    pickupDate ? `Pickup ${pickupDate}` : undefined,
  ]
    .filter(Boolean)
    .join(" | ");
  setHouseholdStore(store);
  return NextResponse.json({ ok: true });
}
