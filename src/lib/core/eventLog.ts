import { randomUUID } from "crypto";
import { EventEmitter } from "events";

export type EventRecord = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  occurredAt: string;
  correlationId?: string;
};

const eventEmitter = new EventEmitter();

let log: EventRecord[] = [
  {
    id: randomUUID(),
    type: "bootstrap.started",
    payload: { version: 2 },
    occurredAt: new Date().toISOString(),
  },
];

export function listEvents(limit = 200) {
  return log.slice(-limit);
}

export function appendEvent(event: Omit<EventRecord, "id" | "occurredAt"> & { id?: string; occurredAt?: string }) {
  const record: EventRecord = {
    id: event.id ?? randomUUID(),
    type: event.type,
    payload: event.payload,
    occurredAt: event.occurredAt ?? new Date().toISOString(),
    correlationId: event.correlationId,
  };
  log = [...log, record];
  eventEmitter.emit("event", record);
  return record;
}

export function subscribe(callback: (event: EventRecord) => void) {
  eventEmitter.on("event", callback);
  return () => {
    eventEmitter.off("event", callback);
  };
}

export function clearLog() {
  log = [];
}

