import { Setup, StepKey, PreviewResponse } from "./validators";

export type StepDefinition = {
  key: StepKey;
  title: string;
  description: string;
  metricsLabel: string;
};

export type DetectResponse = {
  missing: StepKey[];
  progressByStep: Record<StepKey, number>;
  setup: Setup;
};

export type PreviewData = PreviewResponse;

export type SaveRequest = {
  setup: Setup;
  finalize?: boolean;
  enableAutomations?: boolean;
};

export type SaveResponse = {
  ok: boolean;
  setup: Setup;
  created?: Record<string, number>;
  warnings?: string[];
};

export const StepDefinitions: StepDefinition[] = [
  {
    key: "accounts",
    title: "Link accounts",
    description: "Connect Plaid, calendars, drive and email ingest.",
    metricsLabel: "Integrations",
  },
  {
    key: "people",
    title: "Add household contacts",
    description: "Share brothers and vendors for nudges.",
    metricsLabel: "Contacts",
  },
  {
    key: "documents",
    title: "Upload first docs",
    description: "Drop receipts or IDs to test OCR.",
    metricsLabel: "Documents",
  },
  {
    key: "household",
    title: "Describe your household",
    description: "Address, utilities and tracked assets.",
    metricsLabel: "Assets",
  },
  {
    key: "finance",
    title: "Set up finances",
    description: "Income, bills and budgets for automation.",
    metricsLabel: "Items",
  },
  {
    key: "health",
    title: "Care & meds",
    description: "Capture meds to track refills and reminders.",
    metricsLabel: "Profiles",
  },
  {
    key: "automations",
    title: "Automation rules",
    description: "Pre-build nudges and automations.",
    metricsLabel: "Rules",
  },
  {
    key: "goals",
    title: "Household goals",
    description: "Create goals and funding plans.",
    metricsLabel: "Goals",
  },
];
