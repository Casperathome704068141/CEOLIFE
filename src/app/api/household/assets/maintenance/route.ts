import { NextResponse } from "next/server";
import { getHouseholdStore, setHouseholdStore } from "../../store";

export async function POST(request: Request) {
  const body = await request.json();
  const store = getHouseholdStore();
  const { assetId } = body as { assetId: string };
  const asset = store.assets.find((item) => item.id === assetId);
  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  if (body.markServiced) {
    const performedAt = new Date().toISOString();
    const note: string | undefined = body.note;
    asset.maintenance = asset.maintenance ?? {};
    asset.maintenance.history = [
      ...(asset.maintenance.history ?? []),
      { performedAt, note },
    ];
    if (asset.maintenance.cadenceDays) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + asset.maintenance.cadenceDays);
      asset.maintenance.next = nextDate.toISOString();
    }
    setHouseholdStore(store);
    return NextResponse.json(asset);
  }

  const { next, cadenceDays } = body as { next: string; cadenceDays?: number };
  asset.maintenance = {
    ...(asset.maintenance ?? {}),
    next,
    cadenceDays,
  };
  setHouseholdStore(store);
  return NextResponse.json(asset);
}
