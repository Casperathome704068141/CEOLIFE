import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getHouseholdStore, setHouseholdStore } from "../store";
import type { Member } from "@/lib/household/types";

export async function GET() {
  const store = getHouseholdStore();
  return NextResponse.json(store.members);
}

export async function POST(request: Request) {
  const body = await request.json();
  const store = getHouseholdStore();
  const { action } = body as { action?: string };

  if (action === "create") {
    const payload = body.payload as Partial<Member> & { name: string; relation: Member["relation"] };
    const newMember: Member = {
      id: payload.id ?? randomUUID(),
      name: payload.name,
      relation: payload.relation,
      phone: payload.phone,
      notes: payload.notes,
      roleLabel: payload.roleLabel ?? "Family",
    };
    store.members = [...store.members, newMember];
    if (payload.memberId) {
      // ignore; compatibility stub
    }
    setHouseholdStore(store);
    return NextResponse.json(store.members, { status: 201 });
  }

  if (action === "role") {
    const { memberId, roleLabel } = body as { memberId: string; roleLabel: string };
    store.members = store.members.map((member) =>
      member.id === memberId ? { ...member, roleLabel: roleLabel as Member["roleLabel"] } : member,
    );
    setHouseholdStore(store);
    return NextResponse.json(store.members);
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
