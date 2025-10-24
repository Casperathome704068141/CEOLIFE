import { NextRequest, NextResponse } from "next/server";
import { getQueue } from "@/lib/core/projections";
import { queueItemSchema } from "@/lib/graph/types";

export async function GET(request: NextRequest) {
  const filter = request.nextUrl.searchParams.get("filter") ?? undefined;
  const queue = getQueue(filter);
  const items = queue.map(item => queueItemSchema.parse(item));
  return NextResponse.json({ items });
}

