import { NextRequest } from "next/server";
import type { ClassifyResponse } from "@/lib/assistant/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const text: string | undefined = body.text;
  const response: ClassifyResponse = {
    type: text?.toLowerCase().includes("statement") ? "bank-statement" : "receipt",
    confidence: 0.92,
    proposedActions: [
      {
        label: "Create transactions",
        tool: "transaction",
        payloadPreview: { count: 3, total: 186.43 },
      },
      {
        label: "Save to Vault",
        tool: "vault",
        payloadPreview: { folder: "Receipts", expiresAt: "2024-12-01" },
      },
    ],
  };
  return Response.json(response);
}
