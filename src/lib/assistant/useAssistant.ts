"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import type {
  AssistantMessage,
  AssistantMessageBase,
  AssistantMode,
  AssistantActionResult,
  ExecLogEntry,
  Action,
} from "./types";
import { createIdempotencyKey } from "./idempotency";

function createBaseMessage(): AssistantMessageBase {
  return { id: crypto.randomUUID(), createdAt: new Date().toISOString() };
}

function parseSSEPayload(chunk: string): Array<Record<string, unknown>> {
  return chunk
    .split("\n\n")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const data = part.replace(/^data:\s*/, "");
      try {
        return JSON.parse(data);
      } catch (error) {
        console.warn("Failed to parse SSE payload", error, data);
        return {};
      }
    });
}

export type SendMessageArgs = {
  content: string;
  mode: AssistantMode;
  chips: string[];
  attachments?: { id: string; name: string; type: string }[];
};

type AssistantMessageInput =
  | ({ role: "assistant"; kind: "text"; content: string; actions?: Action[] })
  | ({ role: "assistant"; kind: "briefing"; sections: any })
  | ({ role: "assistant"; kind: "insight"; card: any })
  | ({ role: "assistant"; kind: "decision"; title: string; options: any })
  | ({ role: "assistant"; kind: "rule"; rule: any; testResult?: any })
  | ({ role: "assistant"; kind: "editor"; form: any })
  | ({ role: "user"; content: string });

export function useAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [execLogs, setExecLogs] = useState<Record<string, ExecLogEntry>>({});
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async ({ content, mode, chips, attachments }: SendMessageArgs) => {
      if (!content.trim() && !attachments?.length) return;
      const userMessage: AssistantMessage = {
        ...createBaseMessage(),
        role: "user",
        content,
      };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/assistant/chat", {
          method: "POST",
          body: JSON.stringify({
            message: content,
            mode,
            chips,
            attachments,
          }),
          signal: controller.signal,
        });

        if (!response.body) {
          throw new Error("No response body from assistant");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const payloads = parseSSEPayload(buffer);
          if (!buffer.endsWith("\n\n")) {
            const lastBreak = buffer.lastIndexOf("\n\n");
            if (lastBreak !== -1) {
              buffer = buffer.slice(lastBreak + 2);
            }
          } else {
            buffer = "";
          }
          for (const payload of payloads) {
            handleAssistantPayload(payload);
          }
        }

        setLoading(false);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error(error);
        toast.error("Assistant request failed");
        setLoading(false);
      }
    },
    [],
  );

  const handleAssistantPayload = useCallback(
    (payload: Record<string, unknown>) => {
      if (payload.role === "assistant" && payload.kind === "text") {
        setMessages((prev) => [
          ...prev,
          {
            ...createBaseMessage(),
            role: "assistant",
            kind: "text",
            content: (payload as any).content ?? "",
          },
        ]);
      }

      if (payload.kind === "briefing") {
        setMessages((prev) => [
          ...prev,
          {
            ...createBaseMessage(),
            role: "assistant",
            kind: "briefing",
            sections: (payload as any).sections ?? [],
          },
        ]);
      }

      if (payload.kind === "insight") {
        setMessages((prev) => [
          ...prev,
          {
            ...createBaseMessage(),
            role: "assistant",
            kind: "insight",
            card: (payload as any).card,
          },
        ]);
      }

      if (payload.kind === "decision") {
        setMessages((prev) => [
          ...prev,
          {
            ...createBaseMessage(),
            role: "assistant",
            kind: "decision",
            title: (payload as any).title,
            options: (payload as any).options ?? [],
          },
        ]);
      }

      if (payload.kind === "rule") {
        setMessages((prev) => [
          ...prev,
          {
            ...createBaseMessage(),
            role: "assistant",
            kind: "rule",
            rule: (payload as any).rule,
            testResult: (payload as any).testResult,
          },
        ]);
      }

      if (payload.kind === "editor") {
        setMessages((prev) => [
          ...prev,
          {
            ...createBaseMessage(),
            role: "assistant",
            kind: "editor",
            form: (payload as any).form,
          },
        ]);
      }

      if (payload.execLog) {
        const log = payload.execLog as ExecLogEntry;
        setExecLogs((prev) => ({ ...prev, [log.actionId ?? log.id]: log }));
      }
    },
    [],
  );

  const executeAction = useCallback(
    async (action: Action) => {
      const idempotencyKey = createIdempotencyKey(action.type);
      const endpoint = action.type === "accept" ? action.payload?.tool ?? "transaction" : action.type;
      const route = resolveActionRoute(endpoint as string);
      const body = {
        idempotencyKey,
        payload: action.payload ?? {},
      };
      try {
        const res = await fetch(route, {
          method: "POST",
          body: JSON.stringify(body),
        });
        const json = (await res.json()) as AssistantActionResult;
        const exec: ExecLogEntry = {
          id: idempotencyKey,
          label: action.label,
          state: json.ok ? "success" : "error",
          undoable: json.undoable,
          error: json.error,
          actionId: action.id,
        };
        setExecLogs((prev) => ({ ...prev, [action.id]: exec }));
        return json;
      } catch (error) {
        console.error(error);
        const exec: ExecLogEntry = {
          id: idempotencyKey,
          label: action.label,
          state: "error",
          error: (error as Error).message,
          actionId: action.id,
        };
        setExecLogs((prev) => ({ ...prev, [action.id]: exec }));
        return { ok: false, error: (error as Error).message };
      }
    },
    [],
  );

  const undoExecution = useCallback(async (log: ExecLogEntry) => {
    try {
      await fetch("/api/assistant/undo", {
        method: "POST",
        body: JSON.stringify({ idempotencyKey: log.id }),
      });
      setExecLogs((prev) => ({
        ...prev,
        [log.actionId ?? log.id]: { ...log, state: "idle" },
      }));
    } catch (error) {
      console.error(error);
      toast.error("Undo failed");
    }
  }, []);

  const latestExecLogs = useMemo(() => execLogs, [execLogs]);

  const injectMessage = useCallback((input: AssistantMessageInput) => {
    setMessages((prev) => [
      ...prev,
      {
        ...createBaseMessage(),
        ...(input as AssistantMessage),
      },
    ]);
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    executeAction,
    undoExecution,
    execLogs: latestExecLogs,
    injectMessage,
  };
}

function resolveActionRoute(tool: string) {
  switch (tool) {
    case "transaction":
      return "/api/assistant/actions/transaction";
    case "bill":
      return "/api/assistant/actions/bill";
    case "goal":
      return "/api/assistant/actions/goal";
    case "schedule":
      return "/api/assistant/actions/schedule";
    case "rule":
      return "/api/assistant/actions/rule";
    case "simulate":
      return "/api/assistant/actions/simulate";
    case "vault":
      return "/api/assistant/actions/vault";
    case "nudge":
      return "/api/assistant/actions/nudge";
    default:
      return "/api/assistant/actions/transaction";
  }
}
