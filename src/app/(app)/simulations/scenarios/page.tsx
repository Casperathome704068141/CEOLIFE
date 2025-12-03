'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ScenarioToolbar } from '@/components/sim/ScenarioToolbar';
import { useSimulations } from '@/lib/sim/useSimulations';
import type { Scenario, ScenarioParameters, ScenarioAssumptions, ShockEvent, SimResult, PlanChangeSummary } from '@/lib/sim/types';

const ScenarioEditor = dynamic(() => import('@/components/sim/ScenarioEditor').then((m) => m.ScenarioEditor), {
  loading: () => <SimSkeleton title="Configuring scenario" />, ssr: false,
});
const ScenarioGrid = dynamic(() => import('@/components/sim/ScenarioGrid').then((m) => m.ScenarioGrid), {
  loading: () => <SimSkeleton title="Loading scenarios" />, ssr: false,
});
const AssumptionsDrawer = dynamic(() => import('@/components/sim/AssumptionsDrawer').then((m) => m.AssumptionsDrawer), {
  loading: () => <SimSkeleton title="Assumptions" />, ssr: false,
});
const ShockEventsEditor = dynamic(() => import('@/components/sim/ShockEventsEditor').then((m) => m.ShockEventsEditor), {
  loading: () => <SimSkeleton title="Shock events" />, ssr: false,
});
const CompareDrawer = dynamic(() => import('@/components/sim/CompareDrawer').then((m) => m.CompareDrawer), {
  loading: () => <SimSkeleton title="Comparison" />, ssr: false,
});
const ApplyPlanDrawer = dynamic(() => import('@/components/sim/ApplyPlanDrawer').then((m) => m.ApplyPlanDrawer), {
  loading: () => <SimSkeleton title="Apply plan" />, ssr: false,
});
const PresetPickerDialog = dynamic(() => import('@/components/sim/PresetPickerDialog').then((m) => m.PresetPickerDialog), {
  loading: () => <SimSkeleton title="Presets" />, ssr: false,
});
const DebtPayoffPlanner = dynamic(() => import('@/components/sim/DebtPayoffPlanner').then((m) => m.DebtPayoffPlanner), {
  loading: () => <SimSkeleton title="Debt planner" />, ssr: false,
});
const ExportShareDialog = dynamic(() => import('@/components/sim/ExportShareDialog').then((m) => m.ExportShareDialog), {
  loading: () => <SimSkeleton title="Share" />, ssr: false,
});

const defaultParams: ScenarioParameters = { horizonMonths: 24 };
const defaultAssumptions: ScenarioAssumptions = { inflationPct: 2.5, returnPct: 4, savingsRatePct: 15 };

const presets = [
  {
    id: 'income-up',
    name: 'Income Increase',
    preset: 'income-change',
    params: { horizonMonths: 18, incomeDeltaPct: 10 },
  },
  {
    id: 'sabbatical',
    name: 'Sabbatical',
    preset: 'travel',
    params: { horizonMonths: 12, travelBudget: 5000, incomeDeltaPct: -100 },
  },
];

export default function ScenariosPage() {
  const { scenarios, createScenario, updateScenario, deleteScenario, run, runMonteCarlo, applyPlan } = useSimulations();
  const [active, setActive] = useState<Scenario | null>(null);
  const [params, setParams] = useState<ScenarioParameters>(defaultParams);
  const [assumptions, setAssumptions] = useState<ScenarioAssumptions>(defaultAssumptions);
  const [shocks, setShocks] = useState<ShockEvent[]>([]);
  const [result, setResult] = useState<SimResult | undefined>();
  const [monteCarlo, setMonteCarlo] = useState<any>();
  const [sensitivity, setSensitivity] = useState<any>();
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);

  const planSummary = useMemo(() => buildPlanSummary(result, params), [result, params]);

  const overlays = useMemo(() => {
    return scenarios
      .filter((s) => compareIds.includes(s.id))
      .map((s, i) => ({
        id: s.id,
        name: s.name,
        color: ['#a855f7', '#ec4899', '#f97316'][i % 3],
        result: s.results!,
      }));
  }, [scenarios, compareIds]);

  const handleRun = async () => {
    const res = await run({ params, assumptions, shocks });
    setResult(res);
  };

  const handleSave = async () => {
    if (active) {
      await updateScenario({
        id: active.id,
        data: { params, assumptions, shocks, results: result },
      });
    }
  };

  return (
    <div className="space-y-6">
      <ScenarioToolbar
        onNew={() => {
          setActive(null);
          setParams(defaultParams);
          setAssumptions(defaultAssumptions);
          setShocks([]);
          setResult(undefined);
        }}
        onPreset={() => setOpenDrawer('presets')}
        onImport={() => {}}
        onShare={() => setOpenDrawer('share')}
        onSave={handleSave}
        canSave={!!active && !!result}
      />
      <ScenarioEditor
        scenario={active}
        params={params}
        assumptions={assumptions}
        shocks={shocks}
        result={result}
        overlays={overlays}
        onParamsChange={setParams}
        onRun={handleRun}
        onOpenAssumptions={() => setOpenDrawer('assumptions')}
        onOpenShocks={() => setOpenDrawer('shocks')}
        onOpenDebtPlanner={() => setOpenDrawer('debt')}
        onOpenCompare={() => setOpenDrawer('compare')}
        onOpenApplyPlan={() => setOpenDrawer('apply')}
        onRunMonteCarlo={(opts) => runMonteCarlo({ params, assumptions, shocks, ...opts }).then(setMonteCarlo)}
        onUseMedianPath={() => {}}
        onApplySensitivity={() => {}}
        sensitivity={sensitivity}
        monteCarlo={monteCarlo}
      />
      <ScenarioGrid
        scenarios={scenarios}
        activeScenarioId={active?.id}
        compareSelection={compareIds}
        onOpen={(s) => {
          setActive(s);
          setParams(s.params);
          setAssumptions(s.assumptions);
          setShocks(s.shocks ?? []);
          setResult(s.results);
        }}
        onDuplicate={async (s) => {
          const newId = await createScenario({ name: `${s.name} (copy)`, params: s.params });
          const newScenario = scenarios.find(sc => sc.id === newId);
          if (newScenario) {
            setActive(newScenario);
            setParams(newScenario.params);
          }
        }}
        onDelete={(s) => deleteScenario(s.id)}
        onToggleCompare={(s) =>
          setCompareIds((prev) => (prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]))
        }
      />

      <AssumptionsDrawer
        open={openDrawer === 'assumptions'}
        onOpenChange={() => setOpenDrawer(null)}
        assumptions={assumptions}
        onSave={(newAssumptions) => {
          setAssumptions(newAssumptions);
          handleRun();
        }}
      />
      <ShockEventsEditor
        open={openDrawer === 'shocks'}
        onOpenChange={() => setOpenDrawer(null)}
        events={shocks}
        onSave={(newShocks) => {
          setShocks(newShocks);
          handleRun();
        }}
      />
      <CompareDrawer
        open={openDrawer === 'compare'}
        onOpenChange={() => setOpenDrawer(null)}
        scenarios={scenarios.filter((s) => s.results)}
        selected={compareIds}
        onSelectionChange={setCompareIds}
        onSetBaseline={() => {}}
      />
      <ApplyPlanDrawer
        open={openDrawer === 'apply'}
        onOpenChange={() => setOpenDrawer(null)}
        result={result}
        params={params}
        summary={planSummary}
        onApply={applyPlan}
      />
      <PresetPickerDialog
        open={openDrawer === 'presets'}
        presets={presets as any}
        onOpenChange={() => setOpenDrawer(null)}
        onSelect={(p) => {
          setParams(p.params);
          setAssumptions(defaultAssumptions);
          setShocks([]);
          setActive(null);
          setResult(undefined);
        }}
      />
      <DebtPayoffPlanner
        open={openDrawer === 'debt'}
        onOpenChange={() => setOpenDrawer(null)}
        onApplyToParameters={(amount) => setParams((p) => ({ ...p, debtPayExtra: amount }))}
        onCreatePlan={() => {}}
      />
      <ExportShareDialog
        open={openDrawer === 'share'}
        onOpenChange={() => setOpenDrawer(null)}
        scenario={active}
        result={result}
        onExport={() => {}}
        onShare={() => {}}
      />
    </div>
  );
}

function buildPlanSummary(result: SimResult | undefined, params: ScenarioParameters): PlanChangeSummary {
  const finalBalance = result?.monthly.at(-1)?.balance ?? 0;
  const runway = result?.runwayMonths ?? 0;
  return {
    budgets: [
      { category: 'Ops Reserve', delta: Math.max(100, Math.round(finalBalance * 0.01)) },
      { category: 'Travel', delta: params.travelBudget ?? 0 },
    ].filter((item) => Number.isFinite(item.delta)),
    automationRules: [
      { id: 'auto-sweep', description: 'Auto-sweep 5% surplus to reserves', enabled: finalBalance > 0 },
      { id: 'runway-guard', description: 'Hold non-essential spend if runway < 3 months', enabled: runway > 0 },
    ],
    debtSchedule: runway < 4 ? [{ month: 'Next cycle', amount: Math.max(0, Math.round(finalBalance * 0.05)) }] : [],
  };
}

function SimSkeleton({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4 text-slate-400">
      <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-cyan-200">
        {title}
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-slate-800" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-800" />
      </div>
    </div>
  );
}
