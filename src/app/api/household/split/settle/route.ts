import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getHouseholdStore, setHouseholdStore } from "../../store";

export async function POST(request: Request) {
  const body = await request.json();
  const store = getHouseholdStore();

  if (body.action === "record") {
    const { payer, amount, method, reference, attachments, currency } = body.payload as {
      payer: string;
      amount: number;
      method: "cash" | "etransfer" | "other";
      reference?: string;
      attachments?: string[];
      currency: string;
    };

    const settlementId = randomUUID();
    store.settlements.push({
      id: settlementId,
      payer,
      amount,
      method,
      date: new Date().toISOString(),
      links: {},
    });

    store.ledger.push({
      id: randomUUID(),
      label: reference ? `Settlement - ${reference}` : "Settlement",
      amount: -Math.abs(amount),
      currency,
      date: new Date().toISOString(),
      payer,
      attachments,
    });

    setHouseholdStore(store);
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (body.action === "settleNow") {
    const { settlements, currency } = body.payload as {
      settlements: { payer: string; amount: number }[];
      currency: string;
    };
    settlements.forEach((entry) => {
      store.ledger.push({
        id: randomUUID(),
        label: `Settle now - ${entry.payer}`,
        amount: entry.amount,
        currency,
        date: new Date().toISOString(),
        payer: entry.payer,
      });
    });
    setHouseholdStore(store);
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
