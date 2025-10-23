import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getHouseholdStore, setHouseholdStore } from "../store";
import type { ShoppingItem, ShoppingList } from "@/lib/household/types";

export async function GET() {
  return NextResponse.json(getHouseholdStore().shoppingLists);
}

export async function POST(request: Request) {
  const body = await request.json();
  const store = getHouseholdStore();
  const { action } = body as { action?: string };

  if (action === "addItem") {
    const payload = body.payload as {
      listId: string;
      label: string;
      qty?: string;
      priority: ShoppingItem["priority"];
      recurring?: boolean;
      priceTarget?: number;
    };
    const list = store.shoppingLists.find((item) => item.id === payload.listId);
    if (!list) {
      return NextResponse.json({ error: "Shopping list not found" }, { status: 404 });
    }
    const item: ShoppingItem = {
      id: randomUUID(),
      label: payload.label,
      qty: payload.qty,
      priority: payload.priority,
      recurring: payload.recurring,
      priceTarget: payload.priceTarget,
      isChecked: false,
    };
    list.items.push(item);
    setHouseholdStore(store);
    return NextResponse.json(list, { status: 201 });
  }

  if (action === "toggle") {
    const { listId, itemId, payload: togglePayload } = body as {
      listId: string;
      itemId: string;
      payload: { listId: string; itemId: string; checked: boolean };
    };
    const list = store.shoppingLists.find((item) => item.id === listId || item.id === togglePayload?.listId);
    const item = list?.items.find((entry) => entry.id === itemId || entry.id === togglePayload?.itemId);
    if (list && item) {
      item.isChecked = togglePayload?.checked ?? body.payload?.checked ?? false;
      setHouseholdStore(store);
      return NextResponse.json(list);
    }
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (action === "priceTarget") {
    const payload = body.payload as { listId: string; itemId: string; priceTarget?: number };
    const list = store.shoppingLists.find((item) => item.id === payload.listId);
    const item = list?.items.find((entry) => entry.id === payload.itemId);
    if (item) {
      item.priceTarget = payload.priceTarget;
      setHouseholdStore(store);
      return NextResponse.json(list);
    }
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (action === "createList") {
    const payload = body.payload as { name: string };
    const list: ShoppingList = { id: randomUUID(), name: payload.name, items: [] };
    store.shoppingLists.push(list);
    setHouseholdStore(store);
    return NextResponse.json(list, { status: 201 });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
