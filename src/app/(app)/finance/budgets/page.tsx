import { ClipboardCheck, PiggyBank, Plus, ShieldCheck, Wallet } from "lucide-react";

import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const budgets = [
  { category: "Housing", limit: 3200, spent: 2400, renewal: "Monthly", status: "On track" },
  { category: "Food & Dining", limit: 1200, spent: 980, renewal: "Monthly", status: "Monitor" },
  { category: "Transportation", limit: 800, spent: 540, renewal: "Monthly", status: "Comfortable" },
  { category: "Personal & Wellness", limit: 650, spent: 520, renewal: "Monthly", status: "Guardrail" },
  { category: "Savings Goals", limit: 1500, spent: 600, renewal: "Monthly", status: "Auto-funded" },
];

const envelopes = [
  { name: "Emergency Fund", target: 6000, funded: 4880 },
  { name: "Travel Reserve", target: 2500, funded: 1200 },
  { name: "Hardware Upgrade", target: 1800, funded: 300 },
];

const guardrails = [
  "Freeze discretionary cards when spend exceeds 85% of the envelope.",
  "Autofund rent + utilities first, then sweep to savings envelopes.",
  "Escalate alerts to SMS when cash runway drops below 90 days.",
  "Route SaaS spend to the corporate card with cashback boost.",
];

export default function BudgetsPage() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Budgets"
        description="Design envelopes, enforce guardrails, and see pacing across every category before the month closes."
        actions={
          <>
            <PageSecondaryAction>Import from accounts</PageSecondaryAction>
            <PagePrimaryAction>Create new budget</PagePrimaryAction>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg">Live budgets</CardTitle>
              <CardDescription>Track pacing and reroute spend before overshoot.</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1 text-xs">
              <ShieldCheck className="h-4 w-4" /> Guardrails on
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets.map((budget) => {
              const progress = Math.min(100, (budget.spent / budget.limit) * 100);
              return (
                <div key={budget.category} className="space-y-2 rounded-lg border bg-card p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                      <div className="font-medium">{budget.category}</div>
                      <div className="text-xs text-muted-foreground">Renews {budget.renewal}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground">${budget.spent.toLocaleString()} / ${budget.limit.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{budget.status}</div>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
            <div className="flex items-center justify-between rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
              <span>Need a shared budget? Invite a collaborator to co-manage.</span>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Share access
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-lg">Envelope health</CardTitle>
            <CardDescription>See how close each goal is to funded.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {envelopes.map((env) => {
              const progress = Math.min(100, (env.funded / env.target) * 100);
              return (
                <div key={env.name} className="space-y-2 rounded-lg border bg-card p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{env.name}</div>
                    <div className="text-xs text-muted-foreground">${env.funded.toLocaleString()} / ${env.target.toLocaleString()}</div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
            <Button variant="ghost" size="sm" className="w-full gap-2 text-foreground">
              <PiggyBank className="h-4 w-4" /> Create envelope
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-lg">Guardrails</CardTitle>
            <CardDescription>Automation to keep spending decisions aligned.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {guardrails.map((rule) => (
              <div key={rule} className="rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground">
                {rule}
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full gap-2">
              <ClipboardCheck className="h-4 w-4" /> Add guardrail
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-lg">Cash allocation</CardTitle>
            <CardDescription>Rebalance envelopes with a single move.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border bg-card p-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Safe to spend</span>
                <Badge variant="outline" className="text-[10px] uppercase">
                  live sync
                </Badge>
              </div>
              <div className="pt-1 text-2xl font-semibold text-foreground">$1,240</div>
              <div className="text-xs text-muted-foreground">After bills, savings, and debt autopay.</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Button variant="outline" className="w-full gap-2">
                <Wallet className="h-4 w-4" /> Move to cash
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <ShieldCheck className="h-4 w-4" /> Fund bills
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-lg">Activity</CardTitle>
            <CardDescription>Recent changes inside your budgets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="rounded-lg border bg-card px-3 py-2">
              Paused discretionary spend after hitting 85% of the Lifestyle envelope.
            </div>
            <div className="rounded-lg border bg-card px-3 py-2">
              Auto-funded $200 to Emergency Fund envelope from weekend cashback.
            </div>
            <div className="rounded-lg border bg-card px-3 py-2">
              Reallocated $150 from Dining to Transportation to cover EV charging.
            </div>
            <Button variant="ghost" size="sm" className="w-full gap-2 text-foreground">
              <Plus className="h-4 w-4" /> View full log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
