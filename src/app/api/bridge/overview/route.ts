import { NextResponse } from "next/server";
import { getOverview } from "@/lib/core/projections";
import { overviewSchema } from "@/lib/graph/types";

export async function GET() {
  const overview = overviewSchema.parse(getOverview());
  return NextResponse.json({ overview });
}
