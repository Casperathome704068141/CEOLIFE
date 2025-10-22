import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const debts = [
  { name: "Student Loan", principal: 18400, apr: 3.2, minPayment: 220, dueDay: 12, strategy: "snowball" },
  { name: "Auto Loan", principal: 9800, apr: 2.9, minPayment: 310, dueDay: 21, strategy: "avalanche" },
];

export default function DebtsPage() {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Debt orchestration"
        description="Monitor balances, strategies, and accelerate payoff with Beno recommendations."
        actions={
          <>
            <PagePrimaryAction>Add debt</PagePrimaryAction>
            <PageSecondaryAction>Apply extra payment</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {debts.map((debt) => (
          <Card key={debt.name} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">{debt.name}</CardTitle>
              <p className="text-xs text-slate-400">Strategy {debt.strategy}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Principal</span>
                <span>{formatCurrency(debt.principal)}</span>
              </div>
              <div className="flex justify-between">
                <span>APR</span>
                <span>{debt.apr}%</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum payment</span>
                <span>{formatCurrency(debt.minPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span>Due day</span>
                <span>{debt.dueDay}</span>
              </div>
              <Button size="sm" className="w-full rounded-2xl" variant="secondary">
                View amortization
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
