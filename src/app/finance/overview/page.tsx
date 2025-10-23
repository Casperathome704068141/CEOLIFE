import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/shared/sparkline";
import { cashflowData, sparklineData, marketWatchlist } from "@/lib/data";
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

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-white">Markets at a glance</CardTitle>
            <p className="text-xs text-slate-400">Highlights from the stocks and crypto you’re monitoring.</p>
          </div>
          <Button variant="ghost" size="sm" className="rounded-2xl" asChild>
            <Link href="/finance/investments">Open investments</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {marketWatchlist.slice(0, 3).map(asset => {
              const changePositive = asset.change >= 0;
              const changeColor = changePositive ? "text-emerald-400" : "text-rose-400";
              const formattedPrice = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: asset.currency ?? "USD",
                maximumFractionDigits: asset.type === "crypto" ? 0 : 2,
              }).format(asset.price);

              return (
                <div
                  key={asset.symbol}
                  className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{asset.symbol}</p>
                    <Badge variant="outline" className="border-slate-800 text-slate-300">
                      {asset.type === "stock" ? "Stock" : "Crypto"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{asset.name}</p>
                  <div className="mt-3 text-sm font-medium text-white">{formattedPrice}</div>
                  <div className={`text-xs font-semibold ${changeColor}`}>
                    {changePositive ? "+" : ""}
                    {asset.change.toFixed(asset.type === "crypto" ? 0 : 2)} ({asset.changePercent.toFixed(2)}%)
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Allocation {(asset.allocation * 100).toFixed(0)}%
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400">
            Use the investments workspace to dive deeper into trends and connect insights to your household plans.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
