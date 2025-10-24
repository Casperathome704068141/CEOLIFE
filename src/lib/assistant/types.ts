import { ReactNode } from "react";

export type AssistantMode = "brief" | "capture" | "plan" | "coach";

export type ContextChip = {
  id: string;
  label: string;
  active: boolean;
  description?: string;
};

export type ComposerAttachment = {
  id: string;
  name: string;
  type: string;
  size?: number;
  previewUrl?: string;
};

export type ExecState = "idle" | "queued" | "running" | "success" | "error";

export type ActionType =
  | "accept"
  | "schedule"
  | "simulate"
  | "nudge"
  | "open";

export type Action = {
  id: string;
  label: string;
  type: ActionType;
  payload?: Record<string, unknown>;
  disabled?: boolean;
};

export type ExecLogEntry = {
  id: string;
  label: string;
  state: ExecState;
  undoable?: boolean;
  error?: string;
  actionId?: string;
};

export type BriefingSection = {
  id: string;
  title: string;
  description?: string;
  kpi?: string;
  trend?: "up" | "down" | "flat";
  actions?: Action[];
  insight?: string;
};

export type InsightCardPayload = {
  id: string;
  title: string;
  detail: string;
  severity: "info" | "warn" | "risk";
  actions?: Action[];
};

export type DecisionOption = {
  id: string;
  label: string;
  description?: string;
  action: Action;
  recommended?: boolean;
};

export type RuleSpec = {
  id: string;
  name: string;
  trigger: string;
  filters?: string[];
  actions: string[];
  enabled?: boolean;
};

export type RuleTestResult = {
  matches: number;
  preview: Array<{
    id: string;
    summary: string;
  }>;
};

export type EditorField = {
  id: string;
  label: string;
  type: "text" | "number" | "currency" | "date" | "select";
  placeholder?: string;
  defaultValue?: string | number;
  options?: { label: string; value: string }[];
};

export type EditorSpec = {
  id: string;
  title: string;
  description?: string;
  fields: EditorField[];
  submitLabel?: string;
};

export type AssistantMessageBase = {
  id: string;
  createdAt: string;
  execLog?: ExecLogEntry;
};

export type AssistantMessage =
  | (AssistantMessageBase & { role: "user"; content: string })
  | (AssistantMessageBase & {
      role: "assistant";
      kind: "text";
      content: ReactNode | string;
      actions?: Action[];
    })
  | (AssistantMessageBase & {
      role: "assistant";
      kind: "briefing";
      sections: BriefingSection[];
    })
  | (AssistantMessageBase & {
      role: "assistant";
      kind: "insight";
      card: InsightCardPayload;
    })
  | (AssistantMessageBase & {
      role: "assistant";
      kind: "decision";
      title: string;
      options: DecisionOption[];
    })
  | (AssistantMessageBase & {
      role: "assistant";
      kind: "rule";
      rule: RuleSpec;
      testResult?: RuleTestResult;
    })
  | (AssistantMessageBase & {
      role: "assistant";
      kind: "editor";
      form: EditorSpec;
    });

export type ToolCall = {
  id: string;
  tool: string;
  payload: Record<string, unknown>;
};

export type ProposedAction = {
  label: string;
  tool: string;
  payloadPreview: Record<string, unknown>;
};

export type ClassifyResponse = {
  type:
    | "receipt"
    | "bank-statement"
    | "id"
    | "policy"
    | "contract"
    | "med-label"
    | "csv-transactions"
    | "unknown";
  confidence: number;
  proposedActions: ProposedAction[];
};

export type BriefingRunResponse = {
  sections: BriefingSection[];
};

export type AssistantActionResult = {
  ok: boolean;
  id?: string;
  summary?: string;
  deepLink?: string;
  undoable?: boolean;
  error?: string;
};

export type ExecutionUpdate = {
  id: string;
  state: ExecState;
  message?: string;
};

export type CommandSuggestion = {
  id: string;
  trigger: string;
  description: string;
  insertText: string;
};

