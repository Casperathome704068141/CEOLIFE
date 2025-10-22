import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/shared/sparkline";
import { cashflowData, sparklineData } from "@/lib/data";
import Link from "next/link";

export default function FinanceOverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Finance intelligence"
        description="Cashflow analytics, risk signals, and forecasted runway across all linked accounts."
        actions={
          <>
            <PagePrimaryAction>Link bank (Plaid)</PagePrimaryAction>
            <PageSecondaryAction>Scan image</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Cashflow trend – last 6 months</CardTitle>
            <p className="text-xs text-slate-400">Income vs expenses with Beno anomaly detection.</p>
          </CardHeader>
          <CardContent>
            <Sparkline data={cashflowData.map((d) => ({ label: d.month, value: d.income - d.expenses }))} dataKey="value" />
            <Button variant="link" className="text-cyan-300" asChild>
              <Link href="/finance/transactions">Inspect transactions</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">MTD burn vs plan</CardTitle>
            <p className="text-xs text-slate-400">Beno projects +8% variance. Adjust budgets or simulate cuts.</p>
          </CardHeader>
          <CardContent>
            <Sparkline data={sparklineData} dataKey="value" />
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="rounded-2xl" asChild>
                <Link href="/finance/forecasts">Open forecast</Link>
              </Button>
              <Button size="sm" variant="secondary" className="rounded-2xl" asChild>
                <Link href="/finance/rules">Create automation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
