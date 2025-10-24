import { NextResponse } from "next/server";
import { PreviewResponse, SetupSchema, Setup } from "@/lib/onboarding/validators";

function buildFinancePreview(setup: Setup): PreviewResponse["finance"] {
  const finance = setup.data.finance;
  if (!finance) return undefined;
  const forecast: number[] = [];
  let balance = 0;
  for (let month = 0; month < 3; month++) {
    const income = finance.income?.reduce((acc, item) => acc + item.amount, 0) ?? 0;
    const bills = finance.bills?.reduce((acc, bill) => acc + bill.amount, 0) ?? 0;
    balance += income - bills;
    forecast.push(Math.round(balance));
  }
  const bills = (finance.bills ?? []).slice(0, 5).map((bill) => ({
    name: bill.name,
    due: `Day ${bill.dueDay}`,
    amount: bill.amount,
  }));
  return { forecast, bills };
}

function buildCarePreview(setup: Setup): PreviewResponse["care"] {
  const care = setup.data.care;
  if (!care) return undefined;
  return care.flatMap((profile) =>
    profile.meds.map((med) => ({
      person: profile.name,
      nextDose:
        med.schedule.type === "fixed"
          ? med.schedule.times[0] ?? "08:00"
          : `${med.schedule.hours}h interval`,
    }))
  );
}

function buildRulesPreview(setup: Setup): PreviewResponse["rules"] {
  const rules = setup.data.rules;
  if (!rules) return undefined;
  return rules.map((rule) => ({ id: rule.id, count: Math.ceil(Math.random() * 3) }));
}

function readinessScore(setup: Setup): number {
  const completed = Object.values(setup.steps).filter(Boolean).length;
  const base = Math.round((completed / Object.keys(setup.steps).length) * 70);
  const extras = setup.data.finance?.bills?.length ? 10 : 0;
  const goals = setup.data.goals?.length ? 10 : 0;
  const automations = setup.data.rules?.length ? 10 : 0;
  return Math.min(100, base + extras + goals + automations);
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const parse = SetupSchema.partial().safeParse(payload?.setup ?? { data: payload?.data });
  const setup: Setup = parse.success
    ? ({
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
          ...parse.data.data,
        },
      } as Setup)
    : ({
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
        data: { integrations: {} },
      } as Setup);

  const response: PreviewResponse = {
    finance: buildFinancePreview(setup),
    care: buildCarePreview(setup),
    rules: buildRulesPreview(setup),
    readiness: readinessScore(setup),
  };

  return NextResponse.json(response);
}
