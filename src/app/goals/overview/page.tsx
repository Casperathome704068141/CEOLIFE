import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { GoalCard } from "@/components/shared/goal-card";
import { savingsGoals } from "@/lib/data";

export default function GoalsOverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Goals overview"
        description="Progress rings, target dates, and priority sorting."
        actions={
          <>
            <PagePrimaryAction>Create goal</PagePrimaryAction>
            <PageSecondaryAction>Auto fund rule</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {savingsGoals.map((goal) => (
          <GoalCard
            key={goal.name}
            name={goal.name}
            target={goal.target}
            current={goal.current}
            deadline={goal.deadline}
            priority={goal.priority}
          />
        ))}
      </div>
    </div>
  );
}
