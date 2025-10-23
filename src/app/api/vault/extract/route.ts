import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const text: string = payload?.text ?? "";
  const tags = new Set<string>();
  if (text.toLowerCase().includes("insurance")) tags.add("insurance");
  if (text.toLowerCase().includes("invoice")) tags.add("finance");
  if (text.toLowerCase().includes("rx")) tags.add("medication");

  return NextResponse.json({
    normalized: {
      type: tags.has("insurance") ? "insurance" : "document",
      tags: Array.from(tags),
      confidence: 0.68,
    },
  });
}
