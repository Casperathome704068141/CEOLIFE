import type {
  Action,
  BriefingSection,
  DecisionOption,
  InsightCardPayload,
  RuleSpec,
  RuleTestResult,
  ToolCall,
} from "./types";

export function createBriefingFromToolCall(toolCall: ToolCall): BriefingSection[] {
  const base: BriefingSection[] = [
    {
      id: "cashflow",
      title: "Cashflow",
      kpi: "$18.4k",
      trend: "up",
      description: "Net inflow projected over the next 14 days",
      actions: createDefaultActions("cashflow"),
    },
    {
      id: "bills",
      title: "Upcoming bills",
      description: "5 bills due this week. 2 eligible for auto-pay.",
      actions: createDefaultActions("bills"),
    },
  ];

  if (toolCall.payload?.type === "morning") {
    base.push({
      id: "care",
      title: "Care reminders",
      description: "Doses for Theo & refill Hydroxyurea by Wednesday.",
      actions: createDefaultActions("care"),
    });
  }

  return base;
}

export function createInsightFromToolCall(toolCall: ToolCall): InsightCardPayload {
  return {
    id: `insight-${toolCall.id}`,
    title: "Receipt processed",
    detail:
      "Three grocery transactions detected from Metro and Loblaws. Suggested split by household and reimbursable tags.",
    severity: "info",
    actions: createDefaultActions("transactions"),
  };
}

export function createDecisionFromToolCall(
  toolCall: ToolCall,
): { title: string; options: DecisionOption[] } {
  return {
    title: "Rent ledger anomalies",
    options: [
      {
        id: `${toolCall.id}-merge`,
        label: "Merge duplicate Aug 12 ledger entry",
        description: "Keeps Marcus notified and closes outstanding balance.",
        recommended: true,
        action: {
          id: `${toolCall.id}-merge-action`,
          label: "Accept",
          type: "accept",
          payload: { action: "merge-ledger" },
        },
      },
      {
        id: `${toolCall.id}-schedule`,
        label: "Schedule upcoming payment",
        description: "Settle August rent across shared account.",
        action: {
          id: `${toolCall.id}-schedule-action`,
          label: "Schedule",
          type: "schedule",
          payload: { action: "schedule-payment" },
        },
      },
    ],
  };
}

export function createRuleFromToolCall(toolCall: ToolCall): {
  rule: RuleSpec;
  testResult: RuleTestResult;
} {
  return {
    rule: {
      id: toolCall.id,
      name: "Groceries over 90% budget",
      trigger: "spend_ratio>0.9",
      filters: ["category:groceries"],
      actions: ["Nudge Marcus", "Post to Coach"],
      enabled: true,
    },
    testResult: {
      matches: 2,
      preview: [
        { id: "txn-123", summary: "Metro run $132.44 on Oct 2" },
        { id: "txn-124", summary: "Whole Foods $187.10 on Oct 11" },
      ],
    },
  };
}

export function createEditorFromToolCall(toolCall: ToolCall) {
  return {
    id: toolCall.id,
    title: "Split transaction",
    description: "Distribute the grocery receipt across tags and household members.",
    fields: [
      {
        id: "amount",
        label: "Amount",
        type: "currency",
        defaultValue: "132.44",
      },
      {
        id: "tag",
        label: "Tag",
        type: "select",
        options: [
          { label: "Household", value: "household" },
          { label: "Reimbursable", value: "reimbursable" },
        ],
      },
      {
        id: "note",
        label: "Note",
        type: "text",
        placeholder: "Add context",
      },
    ],
    submitLabel: "Save split",
  };
}

function createDefaultActions(prefix: string): Action[] {
  return [
    { id: `${prefix}-accept`, label: "Accept", type: "accept" },
    { id: `${prefix}-schedule`, label: "Schedule", type: "schedule" },
    { id: `${prefix}-simulate`, label: "Simulate", type: "simulate" },
    { id: `${prefix}-nudge`, label: "Nudge", type: "nudge" },
    { id: `${prefix}-open`, label: "Open in…", type: "open" },
  ];
}
