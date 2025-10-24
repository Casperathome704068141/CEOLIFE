import { NextRequest, NextResponse } from "next/server";
import { commandSchema } from "@/lib/graph/types";
import { registerIdempotencyKey } from "@/lib/core/idempotency";
import { reduceCommand } from "@/lib/core/reducer";
import { appendEvent } from "@/lib/core/eventLog";
import { applyEvents } from "@/lib/core/projections";
import { handleEventsWithRules } from "@/lib/core/rules";
import { recordUndo } from "@/lib/core/undo";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const command = commandSchema.parse(payload);

  const digest = JSON.stringify(command.payload ?? {});
  const accepted = registerIdempotencyKey(command.idempotencyKey, digest);
  if (!accepted) {
    return NextResponse.json({ status: "duplicate" }, { status: 409 });
  }

  const events = reduceCommand(command);
  events.forEach(event => {
    appendEvent(event);
  });

  applyEvents(events);

  events.forEach(event => {
    if (command.type === "bill.markPaid") {
      recordUndo(command.idempotencyKey, {
        commandType: command.type,
        entityId: String(command.payload.billId ?? "unknown"),
        inversePatch: { status: "due" },
        createdAt: new Date().toISOString(),
      });
    }
  });

  const ruleActions = handleEventsWithRules(events);

  return NextResponse.json({ status: "ok", events, ruleActions });
}

