import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const sampleBudgets = [
  { category: "Groceries", limit: 600, spent: 420 },
  { category: "Dining", limit: 350, spent: 310 },
  { category: "Transit", limit: 160, spent: 120 },
  { category: "Wellness", limit: 200, spent: 84 },
];

export default function BudgetsPage() {
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sampleBudgets.map((budget) => {
          const utilization = Math.round((budget.spent / budget.limit) * 100);
          return (
            <Card key={budget.category} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">{budget.category}</CardTitle>
                <p className="text-xs text-slate-400">Limit {budget.limit.toLocaleString("en-CA", { style: "currency", currency: "CAD" })}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={utilization} className="h-2 rounded-full bg-slate-900">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500" />
                </Progress>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Spent</span>
                  <span>
                    {budget.spent.toLocaleString("en-CA", { style: "currency", currency: "CAD" })}
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
    </div>
  );
}
