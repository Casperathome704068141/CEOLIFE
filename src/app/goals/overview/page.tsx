'use client';

import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { GoalCard } from "@/components/shared/goal-card";
import { useCollection, useUser } from "@/firebase";
import type { GoalDoc } from "@/lib/schemas";
import { format } from "date-fns";

export default function GoalsOverviewPage() {
  const { user } = useUser();
  const { data: goals, loading: goalsLoading } = useCollection<GoalDoc>('goals', {
    query: ['ownerId', '==', user?.uid],
  });

  const formatDate = (date: any) => {
    if (!date) return '';
    if (date.toDate) {
      // Firebase Timestamp
      return format(date.toDate(), 'MMM d, yyyy');
    }
    // String date
    return format(new Date(date), 'MMM d, yyyy');
  };

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
        {goalsLoading ? (
          <p>Loading goals...</p>
        ) : (
          goals?.map((goal) => (
            <GoalCard
              key={goal.id}
              name={goal.name}
              target={goal.target}
              current={goal.current}
              deadline={formatDate(goal.deadline)}
              priority={goal.priority}
            />
          ))
        )}
      </div>
    </div>
  );
}
