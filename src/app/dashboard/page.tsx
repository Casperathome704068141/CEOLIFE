"use client";

import { StatTile } from "@/components/shared/stat-tile";
import { BriefingCard } from "@/components/shared/briefing-card";
import { VaultDropzone } from "@/components/shared/vault-dropzone";
import { DocCard } from "@/components/shared/doc-card";
import { GoalCard } from "@/components/shared/goal-card";
import {
  briefingInsights,
} from "@/lib/data";
import {
  Bot,
  Calendar,
  ChevronRight,
  FileText,
  PackageCheck,
  Target,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCollection, useUser } from "@/firebase";
import { DocumentDoc, EventDoc, GoalDoc, ShoppingListDoc } from "@/lib/schemas";
import { useBridge } from "@/lib/hooks/useBridge";
import { formatCurrency, formatPercent } from "@/lib/ui/format";
import { AiSimulation } from "@/components/dashboard/ai-simulation";

export default function DashboardPage() {
  const { user } = useUser();
  const { overview } = useBridge();

  const { data: goals, loading: goalsLoading } = useCollection<GoalDoc>(
    "goals",
    {
      query: ["ownerId", "==", user?.uid],
      skip: !user?.uid,
    }
  );
  const { data: events, loading: eventsLoading } = useCollection<EventDoc>(
    "events",
    {
      query: ["ownerId", "==", user?.uid],
      skip: !user?.uid,
    }
  );
  const { data: documents, loading: documentsLoading } =
    useCollection<DocumentDoc>("documents", {
      query: ["ownerId", "==", user?.uid],
      skip: !user?.uid,
    });
  const { data: shoppingLists, loading: shoppingListsLoading } =
    useCollection<ShoppingListDoc>("shoppingLists", {
      query: ["ownerId", "==", user?.uid],
      skip: !user?.uid,
    });

  const shoppingListItems = shoppingLists?.[0]?.items || [];

  const statHighlights = overview ? [
      {
        title: "Net worth",
        value: formatCurrency(overview.netWorth),
        delta: "+$4.3K vs last month", // Placeholder
        trend: "up" as const,
      },
      {
        title: "Cash on hand",
        value: formatCurrency(overview.cashOnHand.amount),
        delta: `Burn runway ${overview.cashOnHand.runwayDays} days`,
        trend: "neutral" as const,
      },
      {
        title: "Next bills",
        value: formatCurrency(overview.nextBills.total),
        delta: `${overview.nextBills.count} due within 5 days`,
        trend: "down" as const,
      },
      {
        title: "Monthly burn",
        value: formatCurrency(overview.monthlyBurn.actual),
        delta: `${formatPercent(
          (overview.monthlyBurn.actual / overview.monthlyBurn.target - 1) * 100
        )} vs target`,
        trend: "down" as const,
      },
      {
        title: "Savings progress",
        value: formatPercent(overview.savingsProgress.percent),
        delta: `+${formatCurrency(overview.savingsProgress.delta, "USD")} allocated`,
        trend: "up" as const,
      },
    ]
    : [];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
        {statHighlights.map((stat, index) => (
          <StatTile
            key={stat.title}
            title={stat.title}
            value={stat.value}
            delta={stat.delta}
            trend={stat.trend}
            icon={
              [
                <Wallet key="wallet" />,
                <Wallet key="wallet" />,
                <Calendar key="calendar" />,
                <Wallet key="wallet" />,
                <Target key="target" />,
              ][index]
            }
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <BriefingCard insights={briefingInsights} />

          <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/70">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
                <Calendar className="h-5 w-5 text-cyan-300" /> Today’s schedule
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/schedule/calendar">
                  Open calendar <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {eventsLoading ? (
                <p className="text-slate-400">Loading schedule...</p>
              ) : (
                events?.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 rounded-2xl bg-slate-900/60 p-3"
                  >
                    <div className="rounded-xl bg-slate-800/80 p-2 text-xs text-slate-300">
                      <p>{(event.start as any)?.toDate?.().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).split(' ')[0]}</p>
                      <p className="-mt-1 font-bold">
                        {(event.start as any)?.toDate?.().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).split(' ')[1]}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full rounded-3xl border border-slate-900/60 bg-slate-950/70">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
                <FileText className="h-5 w-5 text-cyan-300" /> Vault inbox
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/vault/documents">
                  Open vault <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <VaultDropzone onFiles={() => {}} />
              {documentsLoading ? (
                <p className="text-slate-400">Loading documents...</p>
              ) : (
                documents?.slice(0, 1).map((doc) => (
                  <DocCard
                    key={doc.id}
                    name={doc.filename}
                    type={doc.type}
                    updatedAt={
                      (doc.updatedAt as any)?.toDate?.().toLocaleDateString() ??
                      "N/A"
                    }
                    icon="File"
                    tags={doc.tags}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/70">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
              <PackageCheck className="h-5 w-5 text-cyan-300" /> Shopping
              assistant
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/household/shopping">
                Open shopping <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {shoppingListsLoading ? (
              <p className="text-slate-400">Loading shopping list...</p>
            ) : (
              shoppingListItems.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-900/60 p-3">
                  <p className="text-sm text-white">{item.label}</p>
                  <Button variant="secondary" size="sm" className="rounded-full">
                    Add to list
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <AiSimulation />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goalsLoading ? (
          <p className="text-slate-400">Loading goals...</p>
        ) : (
          goals?.map((goal) => (
            <GoalCard
              key={goal.id}
              name={goal.name}
              target={goal.target}
              current={goal.current}
              deadline={
                (goal.deadline as any)?.toDate?.().toLocaleDateString() ?? "N/A"
              }
              priority={goal.priority}
            />
          ))
        )}
      </div>
    </div>
  );
}
