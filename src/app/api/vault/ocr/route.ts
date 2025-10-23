import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const filename = typeof file === "object" && "name" in file ? file.name : "scan";

  const response = {
    extracted: {
      text: `Auto-detected content from ${filename}. Placeholder OCR output for local development.`,
      fields: {
        amount: "$129.00",
        merchant: "Beno Labs",
        date: new Date().toISOString().slice(0, 10),
      },
    },
    suggestions: {
      type: "receipt",
      tags: ["to-review", "ocr"],
    },
    links: {},
  };

  return NextResponse.json(response);
}
