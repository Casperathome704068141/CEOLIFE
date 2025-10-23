import { NextResponse } from "next/server";
import { getHouseholdStore } from "../../store";

export async function GET() {
  return NextResponse.json(getHouseholdStore().ledger);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body.action === "export") {
    const store = getHouseholdStore();
    const header = "id,label,amount,currency,date,payer\n";
    const rows = store.ledger
      .map((entry) =>
        [entry.id, entry.label, entry.amount, entry.currency, entry.date, entry.payer]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    return NextResponse.json({ export: `${header}${rows}` });
  }
  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
