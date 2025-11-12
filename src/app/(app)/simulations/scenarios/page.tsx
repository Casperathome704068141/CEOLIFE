'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScenarioEditor } from '@/components/sim/ScenarioEditor';
import { ScenarioToolbar } from '@/components/sim/ScenarioToolbar';
import { ScenarioGrid } from '@/components/sim/ScenarioGrid';
import { AssumptionsDrawer } from '@/components/sim/AssumptionsDrawer';
import { ShockEventsEditor } from '@/components/sim/ShockEventsEditor';
import { CompareDrawer } from '@/components/sim/CompareDrawer';
import { ApplyPlanDrawer } from '@/components/sim/ApplyPlanDrawer';
import { PresetPickerDialog } from '@/components/sim/PresetPickerDialog';
import { DebtPayoffPlanner } from '@/components/sim/DebtPayoffPlanner';
import { ExportShareDialog } from '@/components/sim/ExportShareDialog';
import { useSimulations } from '@/lib/sim/useSimulations';
import type { Scenario, ScenarioParameters, ScenarioAssumptions, ShockEvent, SimResult, PlanChangeSummary } from '@/lib/sim/types';

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
        summary={
          {
            budgets: [{ category: 'Travel', delta: 500 }],
            automationRules: [],
            debtSchedule: [],
          } as PlanChangeSummary
        }
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
