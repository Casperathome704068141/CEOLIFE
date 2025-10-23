import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getHouseholdStore, setHouseholdStore } from "../../store";
import type { MeterReading } from "@/lib/household/types";

export async function GET() {
  return NextResponse.json(getHouseholdStore().meterReadings);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Omit<MeterReading, "id">;
  const reading: MeterReading = { ...payload, id: randomUUID() };
  const store = getHouseholdStore();
  store.meterReadings.push(reading);
  setHouseholdStore(store);
  return NextResponse.json(reading, { status: 201 });
}
