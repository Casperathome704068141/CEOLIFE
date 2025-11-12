'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { GoalGrid } from '@/components/goals/GoalGrid';
import { GoalAnalyticsSidebar } from '@/components/goals/GoalAnalyticsSidebar';
import { CreateGoalDialog } from '@/components/goals/CreateGoalDialog';
import { EditGoalDrawer } from '@/components/goals/EditGoalDrawer';
import { FundGoalDialog } from '@/components/goals/FundGoalDialog';
import { SimulationDrawer } from '@/components/goals/SimulationDrawer';
import { AutoFundRuleDialog } from '@/components/goals/AutoFundRuleDialog';
import { useGoals } from '@/lib/goals/useGoals';
import type { Goal } from '@/lib/goals/types';

export default function GoalsPage() {
  const {
    groupedGoals,
    grouping,
    toggleGrouping,
    analytics,
    suggestion,
    fundingAccounts,
    createGoal,
    updateGoal,
    fundGoal,
    deleteGoal,
    setAutoFundRule,
    runSimulation,
    isLoading,
    isCreating,
  } = useGoals();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editIntent, setEditIntent] = useState<'overview' | 'link'>('overview');
  const [fundingGoal, setFundingGoal] = useState<Goal | null>(null);
  const [simulatingGoal, setSimulatingGoal] = useState<Goal | null>(null);
  const [autoFundingGoal, setAutoFundingGoal] = useState<Goal | null>(null);

  const autoFundInit = useMemo(() => {
    if (!suggestion || !autoFundingGoal) return {};
    if (suggestion.goalId === autoFundingGoal.id) {
      return {
        amount: suggestion.recommendedIncrease,
        frequency: 'weekly' as const,
      };
    }
    return {};
  }, [suggestion, autoFundingGoal]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
      <div className="space-y-6">
        <PageHeader
          title="Goals"
          description="Define and track your financial, household, and personal growth missions."
        />
        <GoalGrid
          groupedGoals={groupedGoals}
          grouping={grouping}
          isLoading={isLoading}
          onCreateGoal={() => setCreateOpen(true)}
          onEdit={(goal, intent) => {
            setEditingGoal(goal);
            setEditIntent(intent ?? 'overview');
          }}
          onFund={setFundingGoal}
          onSimulate={setSimulatingGoal}
          onAutoFund={setAutoFundingGoal}
          onDelete={(goal) => deleteGoal(goal.id)}
        />
      </div>
      <aside className="hidden space-y-4 lg:block">
        <GoalAnalyticsSidebar
          analytics={analytics}
          suggestion={suggestion}
          onApplySuggestion={(s) => {
            const target = groupedGoals.all.find((g) => g.id === s.goalId);
            if (target) setAutoFundingGoal(target);
          }}
          onSimulateSuggestion={(s) => {
             const target = groupedGoals.all.find((g) => g.id === s.goalId);
            if (target) setSimulatingGoal(target);
          }}
          grouping={grouping}
          onToggleGrouping={toggleGrouping}
          onRunAllSimulations={() => {}}
        />
      </aside>

      <CreateGoalDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={createGoal}
        isSubmitting={isCreating}
      />
      <EditGoalDrawer
        goal={editingGoal}
        open={!!editingGoal}
        focusSection={editIntent}
        onOpenChange={(open) => !open && setEditingGoal(null)}
        onSave={(payload) => (editingGoal ? updateGoal({ goalId: editingGoal.id, payload }) : Promise.resolve())}
        onArchive={() => (editingGoal ? deleteGoal(editingGoal.id) : Promise.resolve())}
      />
      <FundGoalDialog
        goal={fundingGoal}
        accounts={fundingAccounts}
        open={!!fundingGoal}
        onOpenChange={(open) => !open && setFundingGoal(null)}
        onFund={(payload) => (fundingGoal ? fundGoal({ goalId: fundingGoal.id, ...payload }) : Promise.resolve())}
      />
      <AutoFundRuleDialog
        goal={autoFundingGoal}
        accounts={fundingAccounts}
        open={!!autoFundingGoal}
        onOpenChange={(open) => !open && setAutoFundingGoal(null)}
        onCreateRule={(payload) => (autoFundingGoal ? setAutoFundRule({ goalId: autoFundingGoal.id, payload }) : Promise.resolve())}
        initialAmount={autoFundInit.amount}
        initialFrequency={autoFundInit.frequency}
      />
      <SimulationDrawer
        goal={simulatingGoal}
        open={!!simulatingGoal}
        onOpenChange={(open) => !open && setSimulatingGoal(null)}
        onSimulate={runSimulation}
      />
    </div>
  );
}
