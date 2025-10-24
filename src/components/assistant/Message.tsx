"use client";

import { cn } from "@/lib/utils";
import type { AssistantMessage, Action, ExecLogEntry } from "@/lib/assistant/types";
import { BriefingCard } from "./BriefingCard";
import { InsightCard } from "./InsightCard";
import { DecisionCard } from "./DecisionCard";
import { RuleCard } from "./RuleCard";
import { InlineEditor } from "./InlineEditor";
import { ActionBar } from "./ActionBar";
import { ExecLog } from "./ExecLog";

export function Message({
  message,
  onAction,
  execLogs,
}: {
  message: AssistantMessage;
  onAction?: (message: AssistantMessage, action: Action) => void;
  execLogs?: Record<string, ExecLogEntry>;
}) {
  const alignment = message.role === "user" ? "items-end" : "items-start";
  const bubbleClass = message.role === "user"
    ? "bg-gradient-to-br from-sky-500/80 to-blue-500/60 text-white"
    : "bg-slate-900/70 text-slate-200";

  const messageActions = extractActions(message);
  const logs = messageActions
    .map((action) => (action ? execLogs?.[action.id] : undefined))
    .filter(Boolean) as ExecLogEntry[];

  return (
    <div className={cn("flex w-full", alignment)}>
      <div className="max-w-2xl space-y-3">
        {message.role === "user" && (
          <div className={cn("rounded-3xl px-4 py-3 text-sm shadow-lg", bubbleClass)}>
            {message.content}
          </div>
        )}

        {message.role === "assistant" && message.kind === "text" && (
          <div className={cn("rounded-3xl px-4 py-3 text-sm shadow-lg", bubbleClass)}>
            {message.content}
            <div className="mt-3">
              <ActionBar
                actions={message.actions}
                onAction={(action) => onAction?.(message, action)}
              />
            </div>
          </div>
        )}

        {message.role === "assistant" && message.kind === "briefing" && (
          <BriefingCard
            sections={message.sections}
            onAction={(action) => onAction?.(message, action)}
          />
        )}

        {message.role === "assistant" && message.kind === "insight" && (
          <InsightCard
            card={message.card}
            onAction={(action) => onAction?.(message, action)}
          />
        )}

        {message.role === "assistant" && message.kind === "decision" && (
          <DecisionCard
            title={message.title}
            options={message.options}
            onSelect={(option) => onAction?.(message, option.action)}
          />
        )}

        {message.role === "assistant" && message.kind === "rule" && (
          <RuleCard
            rule={message.rule}
            testResult={message.testResult}
            onAction={(action) => onAction?.(message, action)}
          />
        )}

        {message.role === "assistant" && message.kind === "editor" && (
          <InlineEditor
            form={message.form}
            onSubmit={(values) =>
              onAction?.(message, {
                id: `${message.id}-editor-submit`,
                label: "Save",
                type: "accept",
                payload: { values, tool: "transaction" },
              })
            }
          />
        )}

        {logs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {logs.map((log) => (
              <ExecLog key={`${log.actionId}-${log.id}`} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function extractActions(message: AssistantMessage): Action[] {
  if (message.role !== "assistant") return [];
  if (message.kind === "text") return message.actions ?? [];
  if (message.kind === "briefing") return message.sections.flatMap((section) => section.actions ?? []);
  if (message.kind === "insight") return message.card.actions ?? [];
  if (message.kind === "decision") return message.options.map((option) => option.action);
  if (message.kind === "rule")
    return [
      {
        id: `${message.rule.id}-test`,
        label: "Test",
        type: "simulate",
      },
      {
        id: `${message.rule.id}-toggle`,
        label: message.rule.enabled ? "Disable" : "Enable",
        type: "accept",
      },
    ];
  if (message.kind === "editor")
    return [
      {
        id: `${message.id}-editor-submit`,
        label: message.form.submitLabel ?? "Save",
        type: "accept",
      },
    ];
  return [];
}
