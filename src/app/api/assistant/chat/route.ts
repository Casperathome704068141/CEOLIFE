import { NextRequest } from "next/server";
import { createBriefingFromToolCall, createDecisionFromToolCall, createEditorFromToolCall, createInsightFromToolCall, createRuleFromToolCall } from "@/lib/assistant/renderers";
import { validateToolCall } from "@/lib/assistant/toolSchemas";

function streamResponse(chunks: Array<Record<string, unknown>>) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        const payload = `data: ${JSON.stringify(chunk)}\n\n`;
        controller.enqueue(encoder.encode(payload));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      controller.close();
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const message: string = body.message ?? "";
  const mode: string = body.mode ?? "brief";

  const chunks: Array<Record<string, unknown>> = [];

  chunks.push({ role: "assistant", kind: "text", content: `Understood. Switching to ${mode} mode.` });

  if (message.includes("/briefing") || mode === "brief") {
    const toolCall = { id: "briefing-1", tool: "briefing", payload: { type: "morning" } };
    const sections = createBriefingFromToolCall(toolCall);
    chunks.push({ kind: "briefing", sections });
  }

  if (message.toLowerCase().includes("receipt") || message.includes("/add txn")) {
    const toolCall = { id: "receipt-1", tool: "classify", payload: { type: "receipt" } };
    const card = createInsightFromToolCall(toolCall);
    chunks.push({ kind: "insight", card });
    const editor = createEditorFromToolCall(toolCall);
    chunks.push({ kind: "editor", form: editor });
  }

  if (message.toLowerCase().includes("rent") || message.includes("/simulate")) {
    const toolCall = { id: "decision-1", tool: "ledger", payload: { topic: "rent" } };
    const decision = createDecisionFromToolCall(toolCall);
    chunks.push({ kind: "decision", ...decision });
  }

  if (message.includes("/rule")) {
    const toolCall = { id: "rule-1", tool: "rule", payload: { name: "Groceries" } };
    validateToolCall("rule", { name: "Groceries", trigger: "spend_ratio>0.9", actions: ["nudge"] });
    const { rule, testResult } = createRuleFromToolCall(toolCall);
    chunks.push({ kind: "rule", rule, testResult });
  }

  const stream = streamResponse(chunks);
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
