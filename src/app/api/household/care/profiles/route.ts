import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getHouseholdStore, setHouseholdStore } from "../../store";
import type { CareProfile } from "@/lib/household/types";

export async function GET() {
  return NextResponse.json(getHouseholdStore().careProfiles);
}

export async function POST(request: Request) {
  const body = await request.json();
  const store = getHouseholdStore();
  const { action } = body as { action?: string };

  if (action === "upsert") {
    const payload = body.payload as Partial<CareProfile> & { name: string };
    const id = payload.id ?? randomUUID();
    const existingIndex = store.careProfiles.findIndex((profile) => profile.id === id);
    const profile: CareProfile = {
      id,
      memberId: payload.memberId,
      name: payload.name,
      phone: payload.phone,
      tz: payload.tz,
      flags: payload.flags,
    };
    if (existingIndex >= 0) {
      store.careProfiles[existingIndex] = { ...store.careProfiles[existingIndex], ...profile };
    } else {
      store.careProfiles.push(profile);
    }
    setHouseholdStore(store);
    return NextResponse.json(profile, { status: existingIndex >= 0 ? 200 : 201 });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
