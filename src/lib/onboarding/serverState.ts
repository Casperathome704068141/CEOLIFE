import { Setup, StepKey, StepOrder } from "./validators";

const defaultSetup: Setup = {
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

declare global {
  // eslint-disable-next-line no-var
  var __ONBOARDING_STATE__: Setup | undefined;
}

export function getServerSetup(): Setup {
  if (!globalThis.__ONBOARDING_STATE__) {
    globalThis.__ONBOARDING_STATE__ = structuredClone(defaultSetup);
  }
  return globalThis.__ONBOARDING_STATE__ as Setup;
}

export function setServerSetup(next: Setup): Setup {
  globalThis.__ONBOARDING_STATE__ = structuredClone(next);
  return getServerSetup();
}

export function markStep(step: StepKey, completed: boolean): Setup {
  const current = getServerSetup();
  current.steps[step] = completed;
  current.progress = computeProgress(current.steps);
  return setServerSetup(current);
}

export function computeProgress(steps: Setup["steps"]): number {
  const total = StepOrder.length;
  const completed = StepOrder.filter((step) => steps[step]).length;
  return Math.round((completed / total) * 100);
}

export function mergeSetup(partial: Partial<Setup>): Setup {
  const current = getServerSetup();
  const merged: Setup = {
    ...current,
    ...partial,
    steps: { ...current.steps, ...partial.steps },
    data: { ...current.data, ...partial.data },
  };
  merged.progress = computeProgress(merged.steps);
  return setServerSetup(merged);
}
