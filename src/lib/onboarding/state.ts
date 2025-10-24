"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Setup, SetupData, StepKey, StepOrder } from "./validators";

export type DrawerState = {
  open: boolean;
  step?: StepKey;
};

export type PreviewState = {
  readiness: number;
  financeForecast: number[];
  upcomingBills: Array<{ name: string; due: string; amount: number }>;
  care: Array<{ person: string; nextDose: string }>;
  rules: Array<{ id: string; count: number }>;
};

const emptyPreview: PreviewState = {
  readiness: 0,
  financeForecast: [],
  upcomingBills: [],
  care: [],
  rules: [],
};

const blankSetup: Setup = {
  version: 1,
  progress: 0,
  steps: {
    accounts: false,
    people: false,
    documents: false,
    household: false,
    finance: false,
    health: false,
    automations: false,
    goals: false,
  },
  data: {
    integrations: {},
  },
};

function computeProgress(steps: Setup["steps"]): number {
  const total = StepOrder.length;
  const completed = StepOrder.filter((key) => steps[key]).length;
  return Math.round((completed / total) * 100);
}

function ensureContacts(data?: SetupData["contacts"]): SetupData["contacts"] {
  return data?.map((contact) => ({
    defaultChannel: "whatsapp",
    relation: "family",
    ...contact,
  }));
}

export interface OnboardingStore {
  setup: Setup;
  drawer: DrawerState;
  preview: PreviewState;
  loading: boolean;
  focusedStepIndex: number;
  setSetup: (setup: Setup) => void;
  loadFromServer: (setup: Partial<Setup>) => void;
  openDrawer: (step: StepKey) => void;
  closeDrawer: () => void;
  updateStepCompletion: (step: StepKey, completed: boolean) => void;
  updateData: (path: StepKey, data: Partial<SetupData>) => void;
  setPreview: (preview: Partial<PreviewState>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  devtools(
    immer((set, get) => ({
      setup: blankSetup,
      drawer: { open: false },
      preview: emptyPreview,
      loading: false,
      focusedStepIndex: 0,
      setSetup: (setup) =>
        set((state) => {
          state.setup = {
            ...setup,
            steps: { ...setup.steps },
            data: {
              ...setup.data,
              contacts: ensureContacts(setup.data.contacts),
            },
            progress: computeProgress(setup.steps),
          };
        }),
      loadFromServer: (incoming) =>
        set((state) => {
          const next: Setup = {
            ...state.setup,
            ...incoming,
            steps: {
              ...state.setup.steps,
              ...incoming.steps,
            },
            data: {
              ...state.setup.data,
              ...incoming.data,
            },
          } as Setup;
          next.progress = computeProgress(next.steps);
          next.data.contacts = ensureContacts(next.data.contacts);
          state.setup = next;
        }),
      openDrawer: (step) =>
        set((state) => {
          state.drawer = { open: true, step };
          state.focusedStepIndex = StepOrder.indexOf(step);
        }),
      closeDrawer: () =>
        set((state) => {
          state.drawer = { open: false };
        }),
      updateStepCompletion: (step, completed) =>
        set((state) => {
          state.setup.steps[step] = completed;
          state.setup.progress = computeProgress(state.setup.steps);
        }),
      updateData: (step, data) =>
        set((state) => {
          state.setup = {
            ...state.setup,
            data: { ...state.setup.data, ...data },
          };
          state.setup.steps[step] = true;
          state.setup.progress = computeProgress(state.setup.steps);
        }),
      setPreview: (preview) =>
        set((state) => {
          state.preview = { ...state.preview, ...preview };
        }),
      nextStep: () =>
        set((state) => {
          state.focusedStepIndex = (state.focusedStepIndex + 1) % StepOrder.length;
        }),
      prevStep: () =>
        set((state) => {
          state.focusedStepIndex =
            (state.focusedStepIndex - 1 + StepOrder.length) % StepOrder.length;
        }),
    }))
  )
);

export function getFocusedStep(stepIndex: number): StepKey {
  return StepOrder[stepIndex] ?? "accounts";
}

export function createEmptySetup(): Setup {
  return JSON.parse(JSON.stringify(blankSetup));
}
