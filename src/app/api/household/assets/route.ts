import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getHouseholdStore, setHouseholdStore } from "../store";
import type { Asset } from "@/lib/household/types";

export async function GET() {
  return NextResponse.json(getHouseholdStore().assets);
}

export async function POST(request: Request) {
  const body = await request.json();
  const store = getHouseholdStore();
  const { action } = body as { action?: string };

  if (action === "create") {
    const payload = body.payload as Partial<Asset> & { name: string; category: Asset["category"]; condition: Asset["condition"] };
    const asset: Asset = {
      id: payload.id ?? randomUUID(),
      name: payload.name,
      category: payload.category,
      condition: payload.condition,
      serial: payload.serial,
      purchaseDate: payload.purchaseDate,
      purchasePrice: payload.purchasePrice,
      warrantyEnd: payload.warrantyEnd,
      receiptDocId: payload.receiptDocId,
      photos: payload.photos ?? [],
      maintenance: payload.maintenance ?? {},
    };
    const index = store.assets.findIndex((item) => item.id === asset.id);
    if (index >= 0) {
      store.assets[index] = { ...store.assets[index], ...asset };
    } else {
      store.assets.push(asset);
    }
    setHouseholdStore(store);
    return NextResponse.json(asset, { status: index >= 0 ? 200 : 201 });
  }

  if (action === "warranty") {
    const { assetId, warrantyEnd } = body as { assetId: string; warrantyEnd: string };
    const asset = store.assets.find((item) => item.id === assetId);
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }
    asset.warrantyEnd = warrantyEnd;
    setHouseholdStore(store);
    return NextResponse.json(asset);
  }

  if (action === "receipt") {
    const { assetId, receiptDocId } = body as { assetId: string; receiptDocId: string };
    const asset = store.assets.find((item) => item.id === assetId);
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }
    asset.receiptDocId = receiptDocId;
    setHouseholdStore(store);
    return NextResponse.json(asset);
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
