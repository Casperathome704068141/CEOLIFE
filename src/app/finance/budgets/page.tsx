
"use client";

import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useCollection, useUser } from "@/firebase";
import { BudgetDoc } from "@/lib/schemas";
import { formatCurrency } from "@/lib/ui/format";

export default function BudgetsPage() {
  const { user } = useUser();
  const { data: budgets, loading } = useCollection<BudgetDoc>('budgets', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });

  // For now, we'll just display the categories of the first budget document.
  const budgetCategories = budgets?.[0]?.byCategory ? Object.entries(budgets[0].byCategory) : [];

  // Mock spending data for demonstration purposes
  const mockSpending: Record<string, number> = {
    Housing: 2350,
    Groceries: 550,
    Wellness: 150,
    Transit: 120,
    Entertainment: 200,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Budgets"
        description="Envelope tracking with utilization alerts and automation triggers."
        actions={
          <>
            <PagePrimaryAction>Create budget</PagePrimaryAction>
            <PageSecondaryAction>Suggest from history</PageSecondaryAction>
          </>
        }
      />

      {loading ? (
         <p className="text-slate-400">Loading budgets...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {budgetCategories.map(([category, limit]) => {
            const spent = mockSpending[category] ?? 0;
            const utilization = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            return (
              <Card key={category} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{category}</CardTitle>
                  <p className="text-xs text-slate-400">Limit {formatCurrency(limit, 'CAD')}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={utilization} className="h-2 rounded-full bg-slate-900">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500" style={{ width: `${utilization}%`}}/>
                  </Progress>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Spent</span>
                    <span>
                      {formatCurrency(spent, 'CAD')}
                    </span>
                  </div>
                  <Button size="sm" className="rounded-2xl w-full" variant={utilization > 90 ? "destructive" : "secondary"}>
                    {utilization > 90 ? "Trigger automation" : "Adjust envelope"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
