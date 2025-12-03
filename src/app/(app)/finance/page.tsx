import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  BellRing,
  CreditCard,
  Link2,
  PiggyBank,
  PieChart,
  Receipt,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const linkedInstitutions = [
  { name: "Mercury", type: "Business Checking", status: "live", latency: "24s", coverage: "Cash + Cards" },
  { name: "Amex", type: "Personal Credit", status: "live", latency: "14s", coverage: "Cards" },
  { name: "Chase", type: "Mortgage + Checking", status: "pending", latency: "—", coverage: "Cash + Loans" },
];

const cashflow = {
  month: "January",
  inflow: 14200,
  outflow: 9800,
  net: 4400,
  autopayCoverage: 94,
  forecast: "+6.4% vs last month",
};

const budgets = [
  { category: "Housing", allocated: 3200, used: 2400, alerts: "On track" },
  { category: "Food & Dining", allocated: 1200, used: 980, alerts: "Spending fast" },
  { category: "Transportation", allocated: 800, used: 540, alerts: "Room for savings" },
  { category: "Savings Goals", allocated: 1500, used: 600, alerts: "Auto-funded" },
];

const obligations = [
  { label: "Rent + Utilities", due: "Jan 28", amount: 1850, method: "Auto ACH" },
  { label: "AWS + SaaS Stack", due: "Jan 22", amount: 240, method: "Amex Platinum" },
  { label: "Student Loan", due: "Feb 02", amount: 410, method: "Chase Checking" },
];

const accountBalances = [
  { label: "Operating Cash", balance: 42000, change: 6.2, type: "liquid" },
  { label: "Investments", balance: 168400, change: 3.4, type: "growth" },
  { label: "Debt", balance: -12400, change: -0.8, type: "liability" },
];

const insights = [
  "Cash burn is covered for 128 days with current runway settings.",
  "Round up $120 from card transactions to complete the Emergency Fund envelope.",
  "Re-route AWS + SaaS stack spend to Business Checking to unlock 2% cashback boost.",
  "Set a guardrail to pause discretionary spend when net cash drops below $2,500.",
];

export default function FinancePage() {
  const netPercent = Math.min(100, Math.max(0, (cashflow.net / cashflow.inflow) * 100));

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Finance Mission Control"
        description="Link accounts, monitor cash flow, enforce budgets, and keep every money decision visible from one launch console."
        actions={
          <>
            <PageSecondaryAction>Schedule automation</PageSecondaryAction>
            <PagePrimaryAction>
              <Link href="/onboarding">Link a bank or card</Link>
            </PagePrimaryAction>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg">Cash flow ({cashflow.month})</CardTitle>
              <CardDescription>Autopay coverage {cashflow.autopayCoverage}% · {cashflow.forecast}</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Wallet className="h-4 w-4" /> Active
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="text-muted-foreground">Inflow</div>
                <div className="text-2xl font-semibold text-green-500">${cashflow.inflow.toLocaleString()}</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="text-muted-foreground">Outflow</div>
                <div className="text-2xl font-semibold text-amber-500">-${cashflow.outflow.toLocaleString()}</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="text-muted-foreground">Net</div>
                <div className="text-2xl font-semibold">${cashflow.net.toLocaleString()}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Net position</span>
                <span>{netPercent.toFixed(0)}% protected</span>
              </div>
              <Progress value={netPercent} className="h-2" />
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="outline" className="gap-1 text-[11px]">
                  <ShieldCheck className="h-3 w-3" /> Auto-allocate bills
                </Badge>
                <Badge variant="outline" className="gap-1 text-[11px]">
                  <BellRing className="h-3 w-3" /> Smart alerts
                </Badge>
                <Badge variant="outline" className="gap-1 text-[11px]">
                  <PiggyBank className="h-3 w-3" /> Savings sweep enabled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg">Linked institutions</CardTitle>
              <CardDescription>Connect banks, cards, and brokerages for unified control.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href="/onboarding">
                <Link2 className="h-4 w-4" /> Add connection
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {linkedInstitutions.map((inst) => (
              <div
                key={inst.name}
                className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <Banknote className="h-4 w-4 text-emerald-500" />
                    <span>{inst.name}</span>
                    <Badge
                      variant={inst.status === "live" ? "secondary" : "outline"}
                      className="text-[11px] uppercase"
                    >
                      {inst.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{inst.type} · {inst.coverage}</CardDescription>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>Sync latency</div>
                  <div className="font-medium text-foreground">{inst.latency}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
              <span>Need brokerage data? Invite your advisor to the vault.</span>
              <Button size="sm" variant="ghost" className="gap-2 text-foreground">
                <ArrowUpRight className="h-4 w-4" /> Share access
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg">Budgets & envelopes</CardTitle>
              <CardDescription>Guardrails, pacing, and savings envelopes in one view.</CardDescription>
            </div>
            <Button size="sm" className="gap-2" asChild>
              <Link href="/finance/budgets">
                <PieChart className="h-4 w-4" /> Manage budgets
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets.map((budget) => {
              const percentUsed = Math.min(100, (budget.used / budget.allocated) * 100);
              return (
                <div key={budget.category} className="space-y-2 rounded-lg border bg-card p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{budget.category}</div>
                    <div className="text-muted-foreground">${budget.used.toLocaleString()} / ${budget.allocated.toLocaleString()}</div>
                  </div>
                  <Progress value={percentUsed} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{budget.alerts}</span>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px]">
                      <Receipt className="h-3 w-3" /> Review activity
                    </Button>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
              <span>Create a buffer envelope to catch weekend overspend automatically.</span>
              <Button variant="outline" size="sm" className="gap-2">
                <PiggyBank className="h-4 w-4" /> New envelope
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-lg">Upcoming obligations</CardTitle>
            <CardDescription>Autopay sequence keeps cash flow stable.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {obligations.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm"
              >
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">Due {item.due} · {item.method}</div>
                </div>
                <div className="text-right text-sm font-semibold text-foreground">${item.amount.toLocaleString()}</div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full gap-2 text-foreground">
              <CreditCard className="h-4 w-4" /> Configure routing
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg">Balances & liquidity</CardTitle>
              <CardDescription>Net worth snapshot with daily movement.</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1 text-xs">
              <ArrowUpRight className="h-4 w-4" /> Export report
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {accountBalances.map((acct) => (
              <div key={acct.label} className="space-y-2 rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{acct.label}</span>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {acct.type}
                  </Badge>
                </div>
                <div className="text-2xl font-semibold">
                  {acct.balance < 0 ? "-" : ""}${Math.abs(acct.balance).toLocaleString()}
                </div>
                <div className={`text-xs ${acct.change >= 0 ? "text-green-500" : "text-amber-500"}`}>
                  {acct.change >= 0 ? "▲" : "▼"} {Math.abs(acct.change)}% today
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-lg">Ops console</CardTitle>
            <CardDescription>Fast actions for money moves.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/finance/transactions">
                Reconcile transactions <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/finance/forecasts">
                Run cash forecast <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/finance/rules">
                Update automation rules <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/finance/debts">
                Pay down debt <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-lg">Insights & guardrails</CardTitle>
          <CardDescription>Pulse signals derived from your balances, budgets, and cash flow.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {insights.map((item, idx) => (
            <div
              key={item}
              className="flex h-full flex-col justify-between rounded-lg border bg-card p-3 text-sm text-muted-foreground"
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  #{idx + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </div>
              <Button variant="ghost" size="sm" className="mt-4 w-fit gap-1 text-[11px]">
                <ArrowUpRight className="h-3 w-3" /> Apply change
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
