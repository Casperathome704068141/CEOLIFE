import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getHouseholdStore, setHouseholdStore } from "../../store";
import type { Ticket } from "@/lib/household/types";

export async function GET() {
  return NextResponse.json(getHouseholdStore().tickets);
}

export async function POST(request: Request) {
  const body = await request.json();
  const store = getHouseholdStore();
  const { action } = body as { action?: string };

  if (action === "upsert") {
    const payload = body.payload as Partial<Ticket> & {
      apartmentId: string;
      title: string;
      type: Ticket["type"];
      severity: Ticket["severity"];
      status?: Ticket["status"];
    };
    const ticket: Ticket = {
      id: payload.id ?? randomUUID(),
      apartmentId: payload.apartmentId,
      title: payload.title,
      type: payload.type,
      severity: payload.severity,
      status: payload.status ?? "open",
      notes: payload.notes,
      photos: payload.photos ?? [],
      due: payload.due,
      assignee: payload.assignee,
    };
    const index = store.tickets.findIndex((item) => item.id === ticket.id);
    if (index >= 0) {
      store.tickets[index] = { ...store.tickets[index], ...ticket };
    } else {
      store.tickets.push(ticket);
    }
    setHouseholdStore(store);
    return NextResponse.json(ticket, { status: index >= 0 ? 200 : 201 });
  }

  if (action === "status") {
    const { ticketId, status, assignee } = body as {
      ticketId: string;
      status: Ticket["status"];
      assignee?: string;
    };
    const ticket = store.tickets.find((item) => item.id === ticketId);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
    ticket.status = status;
    if (assignee) {
      ticket.assignee = assignee;
    }
    setHouseholdStore(store);
    return NextResponse.json(ticket);
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
