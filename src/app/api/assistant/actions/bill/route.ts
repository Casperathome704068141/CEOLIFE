import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return Response.json({
    ok: true,
    id: `bill-${Date.now()}`,
    summary: "Bill scheduled",
    undoable: true,
    deepLink: "/finance/bills",
  });
}
