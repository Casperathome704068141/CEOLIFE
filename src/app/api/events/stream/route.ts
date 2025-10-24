import { NextResponse } from "next/server";
import { registerClient } from "@/lib/core/sse";

export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();
  let cleanup: (() => void) | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (message: string) => controller.enqueue(encoder.encode(message));
      cleanup = registerClient(send);
      send(`data: ${JSON.stringify({ keys: ["bridge:overview"] })}\n\n`);
    },
    cancel() {
      cleanup?.();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

