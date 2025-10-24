import { NextRequest, NextResponse } from "next/server";
import { getContextByQueueItemId } from "@/lib/core/projections";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const context = getContextByQueueItemId(id);
  if (!context) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ context });
}

