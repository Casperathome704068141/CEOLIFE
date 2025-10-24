import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return Response.json({
    ok: true,
    id: `vault-${Date.now()}`,
    summary: "Document saved to Vault",
    undoable: true,
  });
}
