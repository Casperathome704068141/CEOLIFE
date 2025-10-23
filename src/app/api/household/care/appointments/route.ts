import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getHouseholdStore, setHouseholdStore } from "../../store";
import type { Appointment } from "@/lib/household/types";

export async function GET() {
  return NextResponse.json(getHouseholdStore().appointments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const store = getHouseholdStore();
  const { action } = body as { action?: string };

  if (action === "create") {
    const payload = body.payload as Partial<Appointment> & {
      careProfileId: string;
      title: string;
      start: string;
      end: string;
      location: string;
    };

    const appointment: Appointment = {
      id: payload.id ?? randomUUID(),
      careProfileId: payload.careProfileId,
      title: payload.title,
      type: payload.type ?? "visit",
      start: payload.start,
      end: payload.end,
      location: payload.location,
      provider: payload.provider,
      notes: payload.notes,
      linkedDocs: payload.linkedDocs ?? [],
    };

    const index = store.appointments.findIndex((appt) => appt.id === appointment.id);
    if (index >= 0) {
      store.appointments[index] = { ...store.appointments[index], ...appointment };
    } else {
      store.appointments.push(appointment);
    }
    setHouseholdStore(store);
    return NextResponse.json(appointment, { status: index >= 0 ? 200 : 201 });
  }

  if (action === "linkDoc") {
    const { appointmentId, docId } = body as { appointmentId: string; docId: string };
    const appointment = store.appointments.find((appt) => appt.id === appointmentId);
    if (appointment) {
      appointment.linkedDocs = Array.from(new Set([...(appointment.linkedDocs ?? []), docId]));
      setHouseholdStore(store);
      return NextResponse.json(appointment);
    }
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
