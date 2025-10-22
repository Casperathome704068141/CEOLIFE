'use client';

import Link from 'next/link';
import {
  briefingInsights,
  sparklineData,
  statHighlights,
  vaultInboxHints,
} from '@/lib/data';
import { PageHeader, PagePrimaryAction, PageSecondaryAction } from '@/components/layout/page-header';
import { StatTile } from '@/components/shared/stat-tile';
import { BriefingCard } from '@/components/shared/briefing-card';
import { Sparkline } from '@/components/shared/sparkline';
import { GoalCard } from '@/components/shared/goal-card';
import { DocCard } from '@/components/shared/doc-card';
import { VaultDropzone } from '@/components/shared/vault-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlarmClock, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { useCollection, useUser } from '@/firebase';
import type { BillDoc, DocumentDoc, GoalDoc, ShoppingListDoc } from '@/lib/schemas';
import { format } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();

  const { data: goals, loading: goalsLoading } = useCollection<GoalDoc>('goals', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });
  const { data: bills, loading: billsLoading } = useCollection<BillDoc>('bills', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });
  const { data: documents, loading: documentsLoading } = useCollection<DocumentDoc>('documents', {
    query: ['owner', '==', user?.uid],
    skip: !user?.uid,
  });
  const { data: shoppingLists, loading: shoppingListsLoading } = useCollection<ShoppingListDoc>('shoppingLists', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });

  const shoppingList = shoppingLists?.[0]?.items || [];


  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value);
  
  const formatDate = (date: any) => {
    if (!date) return '';
    if (date.toDate) {
      // Firebase Timestamp
      return format(date.toDate(), 'MMM d, yyyy');
    }
    // String date
    return format(new Date(date), 'MMM d, yyyy');
  };

  const schedule = [
    { time: '07:30', title: 'Morning briefing', description: 'Review priorities with Beno' },
    { time: '09:00', title: 'Ops sync', description: 'Finance + household status' },
    { time: '13:00', title: 'Lunch with Leo', description: 'Discuss shared budget' },
    { time: '18:30', title: 'Gym & wellness', description: 'Strength routine' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Executive Ops Brief"
        description="Finance, household, and wellness telemetry unified for Beno 1017."
        actions={
          <>
            <PagePrimaryAction>Run evening briefing</PagePrimaryAction>
            <PageSecondaryAction>Share snapshot</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {statHighlights.map(stat => (
          <StatTile
            key={stat.title}
            title={stat.title}
            value={stat.value}
            delta={stat.delta}
            trend={stat.trend}
            onClick={() => router.push(stat.title === 'Net worth' ? '/finance/overview' : '/finance/transactions')}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="col-span-12 lg:col-span-5 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold text-white">Today’s schedule</CardTitle>
              <p className="text-sm text-slate-400">Timeboxed plan connected to routines and automations.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" className="rounded-2xl" asChild>
                <Link href="/schedule/calendar?intent=add">Add event</Link>
              </Button>
              <Button variant="secondary" size="sm" className="rounded-2xl" asChild>
                <Link href="/vault/documents?intent=link">Link doc</Link>
              </Button>
              <Button variant="secondary" size="sm" className="rounded-2xl" asChild>
                <Link href="/schedule/calendar?intent=snooze">
                  <AlarmClock className="mr-1 h-3 w-3" /> Snooze
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {schedule.map(event => (
                <li key={`${event.time}-${event.title}`} className="flex items-start gap-4">
                  <div className="min-w-[60px] rounded-xl bg-slate-900/60 px-3 py-1 text-center text-xs font-semibold text-cyan-200">
                    {event.time}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="col-span-12 space-y-6 lg:col-span-7">
          <BriefingCard
            insights={briefingInsights}
            onExpand={() => router.push('/assistant?tab=briefing')}
            onRunSimulation={() => router.push('/simulations/scenarios')}
            onCreateRule={() => router.push('/finance/rules?intent=new')}
            onSendNudge={() => router.push('/household/shopping?intent=nudge')}
          />

          <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg text-white">Cashflow sparkline</CardTitle>
                <p className="text-xs text-slate-400">Income vs expense this week • tap to open Finance → Overview</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-2xl" onClick={() => router.push('/finance/overview')}>
                View detail <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Sparkline data={sparklineData} dataKey="value" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="col-span-12 lg:col-span-6 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white">Goals snapshot</CardTitle>
              <p className="text-xs text-slate-400">Track shared ambitions and funding progress.</p>
            </div>
            <Button size="sm" className="rounded-2xl" onClick={() => router.push('/goals/overview?intent=allocate')}>
              Allocate $
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {goalsLoading ? (
              <p>Loading goals...</p>
            ) : (
              goals?.map(goal => (
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
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-6 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white">Vault inbox</CardTitle>
              <p className="text-xs text-slate-400">Drop receipts, IDs, or contracts. Beno handles OCR & encryption.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="rounded-2xl" asChild>
                <Link href="/vault/documents?intent=upload">
                  <Upload className="mr-2 h-3 w-3" /> Upload
                </Link>
              </Button>
              <Button variant="secondary" size="sm" className="rounded-2xl" asChild>
                <Link href="/vault/documents?intent=parse">Parse all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <VaultDropzone onFiles={() => router.push('/vault/documents?intent=upload')} />
            <div className="space-y-3">
              {vaultInboxHints.map(hint => (
                <div key={hint.id} className="rounded-2xl border border-slate-900/60 bg-slate-900/60 p-4 text-sm text-slate-300">
                  <p className="font-medium text-white">{hint.title}</p>
                  <p className="text-xs text-slate-400">{hint.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="col-span-12 lg:col-span-4 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white">Upcoming bills</CardTitle>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-2xl"
              onClick={() => router.push('/finance/transactions?tab=bills')}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {billsLoading ? (
              <p>Loading bills...</p>
            ) : (
              bills?.map(bill => (
                <div key={bill.id} className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-white">{bill.name}</p>
                    <p className="text-xs text-slate-400">Due {formatDate(bill.dueDate)}</p>
                  </div>
                  <div className="text-sm font-semibold text-cyan-200">{formatCurrency(bill.amount)}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-4 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Documents spotlight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {documentsLoading ? (
              <p>Loading documents...</p>
            ) : (
              documents?.slice(0, 3).map(doc => (
                <DocCard
                  key={doc.id}
                  name={doc.filename}
                  type={doc.type}
                  updatedAt={formatDate(doc.createdAt)}
                  icon={"FileText"}
                  tags={doc.tags}
                />
              ))
            )}
            <Button variant="link" className="text-cyan-300" asChild>
              <Link href="/vault/documents">
                Manage vault <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-4 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Shopping & essentials</CardTitle>
            <p className="text-xs text-slate-400">Coordinated list for the household.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2">
              {shoppingListsLoading ? (
                <p>Loading shopping list...</p>
              ) : (
                shoppingList.map((item: any) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-cyan-300">
                      {item.isRecurring ? 'Recurring' : 'One-time'}
                    </span>
                  </li>
                ))
              )}
            </ul>
            <Separator className="bg-slate-800" />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="rounded-2xl" asChild>
                <Link href="/household/shopping?intent=share">
                  Send to brothers <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
              <Button size="sm" variant="secondary" className="rounded-2xl" asChild>
                <Link href="/household/split">Open split ledger</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    