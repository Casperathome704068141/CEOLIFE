
"use client";

import { StatTile } from "@/components/shared/stat-tile";
import { BriefingCard } from "@/components/shared/briefing-card";
import { VaultDropzone } from "@/components/shared/vault-dropzone";
import { DocCard } from "@/components/shared/doc-card";
import { GoalCard } from "@/components/shared/goal-card";
import {
  briefingInsights,
  cashflowData,
  schedule,
  statHighlights,
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
import { Sparkline } from "@/components/shared/sparkline";
import { useCollection, useUser } from "@/firebase";
import { GoalDoc } from "@/lib/schemas";

export default function DashboardPage() {
  const { user } = useUser();
  const { data: goals, loading: goalsLoading } = useCollection<GoalDoc>(
    "goals",
    {
      query: ["ownerId", "==", user?.uid],
      skip: !user?.uid,
    }
  );
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
              {schedule.map((event) => (
                <div
                  key={event.title}
                  className="flex items-center gap-3 rounded-2xl bg-slate-900/60 p-3"
                >
                  <div className="rounded-xl bg-slate-800/80 p-2 text-xs text-slate-300">
                    <p>{event.time.split(" ")[0]}</p>
                    <p className="-mt-1 font-bold">
                      {event.time.split(" ")[1]}
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
              ))}
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
              <DocCard
                name="Q3-2024-report.pdf"
                type="Finance"
                updatedAt="2h ago"
                icon="File"
                tags={["quarterly", "draft"]}
              />
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
            <div className="flex items-center justify-between rounded-2xl bg-slate-900/60 p-3">
              <p className="text-sm text-white">Steel-cut oats</p>
              <Button variant="secondary" size="sm" className="rounded-full">
                Add to list
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-900/60 p-3">
              <p className="text-sm text-white">Air filters (2-pack)</p>
              <Button variant="secondary" size="sm" className="rounded-full">
                Add to list
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/70">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
              <Bot className="h-5 w-5 text-cyan-300" /> Beno AI
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/assistant">
                Open assistant <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <Sparkline
              data={cashflowData.map((d) => ({
                label: d.month,
                value: d.income - d.expenses,
              }))}
              dataKey="value"
            />
            <p className="text-xs text-slate-400">
              Cashflow anomaly detected. Review transactions from last week.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals?.map((goal) => (
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
        ))}
      </div>
    </div>
  );
}
