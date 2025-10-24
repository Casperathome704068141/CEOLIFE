import { Setup } from "./validators";

type CountMap = Record<string, number>;

function countArray<T>(value?: T[] | null): number {
  return Array.isArray(value) ? value.length : 0;
}

export async function writeBackToCollections(
  setup: Setup,
  enableAutomations: boolean
): Promise<{ created: CountMap; warnings?: string[] }> {
  const created: CountMap = {
    accounts: setup.data.integrations ? Object.keys(setup.data.integrations).length : 0,
    contacts: countArray(setup.data.contacts),
    documents: countArray(setup.data.docs),
    assets: countArray(setup.data.household?.assets),
    incomeStreams: countArray(setup.data.finance?.income),
    bills: countArray(setup.data.finance?.bills),
    careProfiles: countArray(setup.data.care),
    rules: countArray(setup.data.rules),
    goals: countArray(setup.data.goals),
  };

  const warnings: string[] = [];
  if (!enableAutomations && created.rules > 0) {
    warnings.push("Automations remain disabled. Enable them later from Automations module.");
  }

  await new Promise((resolve) => setTimeout(resolve, 150));

  return { created, warnings: warnings.length ? warnings : undefined };
}
