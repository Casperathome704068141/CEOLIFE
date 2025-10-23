'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  briefingInsights,
  sparklineData,
  statHighlights,
  vaultInboxHints,
  medicationRegimen,
  careTeamAppointments,
  marketWatchlist,
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, AlarmClock, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { useCollection, useUser } from '@/firebase';
import type { BillDoc, DocumentDoc, GoalDoc, ShoppingListDoc } from '@/lib/schemas';
import { format, formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [hideBalances, setHideBalances] = useState(false);

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

  const totalTabsNeeded = medicationRegimen.reduce((sum, med) => sum + med.tabsNeeded, 0);
  const totalTabsTaken = medicationRegimen.reduce((sum, med) => sum + med.tabsTaken, 0);
  const adherence = totalTabsNeeded === 0 ? 100 : Math.round((totalTabsTaken / totalTabsNeeded) * 100);
  const nextRefill = medicationRegimen.reduce<
    { medication: (typeof medicationRegimen)[number]; date: Date } | null
  >((nearest, med) => {
    const date = new Date(med.refillDate);
    if (!nearest || date < nearest.date) {
      return { medication: med, date };
    }
    return nearest;
  }, null);
  const nextAppointment = careTeamAppointments.reduce<
    { appointment: (typeof careTeamAppointments)[number]; date: Date } | null
  >((soonest, appointment) => {
    const date = new Date(appointment.date);
    if (!soonest || date < soonest.date) {
      return { appointment, date };
    }
    return soonest;
  }, null);
  const watchlistPreview = marketWatchlist.slice(0, 3);
  const stockAllocation = marketWatchlist
    .filter(asset => asset.type === 'stock')
    .reduce((sum, asset) => sum + asset.allocation, 0);
  const cryptoAllocation = marketWatchlist
    .filter(asset => asset.type === 'crypto')
    .reduce((sum, asset) => sum + asset.allocation, 0);
  const trackedTotalAllocation = stockAllocation + cryptoAllocation;
  const stockAllocationPercent =
    trackedTotalAllocation === 0 ? 0 : Math.round((stockAllocation / trackedTotalAllocation) * 100);
  const cryptoAllocationPercent =
    trackedTotalAllocation === 0 ? 0 : Math.round((cryptoAllocation / trackedTotalAllocation) * 100);

  const formatAssetPrice = (asset: (typeof marketWatchlist)[number]) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: asset.currency ?? 'USD',
      maximumFractionDigits: asset.type === 'crypto' ? 0 : 2,
    }).format(asset.price);

  const maskValue = (value: string) => (hideBalances ? '••••' : value);


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
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl border-slate-700 bg-slate-900/40 text-slate-200"
              onClick={() => setHideBalances(prev => !prev)}
            >
              {hideBalances ? 'Show balances' : 'Hide balances'}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {statHighlights.map(stat => (
          <StatTile
            key={stat.title}
            title={stat.title}
            value={maskValue(String(stat.value))}
            delta={hideBalances ? 'Hidden' : stat.delta}
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
        <Card className="col-span-12 lg:col-span-5 space-y-4 rounded-3xl border border-slate-900/60 bg-slate-950/80 p-0 shadow-xl">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg text-white">Medication tracker</CardTitle>
              <p className="text-xs text-slate-400">Keep tabs on doses, refills, and appointments for your brother.</p>
            </div>
            <Badge variant="secondary" className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-200">
              {adherence}% today
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/60 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-400">Adherence snapshot</div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-200">
                <span>Tabs swallowed</span>
                <span>
                  {totalTabsTaken} / {totalTabsNeeded}
                </span>
              </div>
              <Progress value={adherence} className="mt-3 h-2 rounded-full bg-slate-800" />
              {nextRefill ? (
                <p className="mt-3 text-xs text-slate-400">
                  Next refill: {nextRefill.medication.name}{' '}
                  {formatDistanceToNow(nextRefill.date, { addSuffix: true })}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              {medicationRegimen.map(med => (
                <div
                  key={med.name}
                  className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{med.name}</p>
                      <p className="text-xs text-slate-400">
                        {med.dosage} • {med.timing}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-cyan-500/40 text-cyan-200">
                      {med.tabsTaken}/{med.tabsNeeded} swallowed
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>{med.tabletsRemaining} tablets left</span>
                    <span>
                      Refill{' '}
                      {formatDistanceToNow(new Date(med.refillDate), { addSuffix: true })}
                    </span>
                  </div>
                  {med.notes ? <p className="mt-2 text-xs text-slate-500">{med.notes}</p> : null}
                </div>
              ))}
            </div>

            {nextAppointment ? (
              <div className="rounded-2xl border border-slate-900/60 bg-slate-900/60 p-4 text-sm text-slate-300">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium text-white">Next appointment</span>
                  <Badge variant="secondary" className="rounded-2xl bg-emerald-500/10 text-emerald-200">
                    {format(nextAppointment.date, 'MMM d • h:mma')}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {nextAppointment.appointment.provider} — {nextAppointment.appointment.focus}
                </p>
                <p className="mt-1 text-xs text-slate-500">{nextAppointment.appointment.location}</p>
                {nextAppointment.appointment.preparation ? (
                  <p className="mt-2 text-xs text-slate-500">
                    Prep: {nextAppointment.appointment.preparation}
                  </p>
                ) : null}
              </div>
            ) : null}

            <Button size="sm" className="rounded-2xl" asChild>
              <Link href="/household/medications">
                Open care log <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-7 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white">Market watchlist</CardTitle>
              <p className="text-xs text-slate-400">Stocks and crypto you’re tracking to learn the market pulse.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-2xl"
              onClick={() => router.push('/finance/investments')}
            >
              Manage <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {watchlistPreview.map(asset => {
                const changePositive = asset.change >= 0;
                const changeColor = changePositive ? 'text-emerald-400' : 'text-rose-400';
                const changeValue = `${changePositive ? '+' : ''}${asset.change.toFixed(
                  asset.type === 'crypto' ? 0 : 2,
                )}`;
                return (
                  <div
                    key={asset.symbol}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{asset.symbol}</p>
                        <Badge variant="outline" className="border-slate-800 text-slate-300">
                          {asset.type === 'stock' ? 'Stock' : 'Crypto'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">{asset.name}</p>
                    </div>
                    <div className="flex flex-col items-start gap-1 text-sm font-medium text-white md:items-end">
                      <span>{formatAssetPrice(asset)}</span>
                      <span className={`${changeColor} text-xs font-semibold`}>
                        {changeValue} ({asset.changePercent.toFixed(2)}%)
                      </span>
                      <span className="text-xs text-slate-400">
                        Allocation {(asset.allocation * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Stocks vs crypto</span>
                <span>
                  {stockAllocationPercent}% / {cryptoAllocationPercent}%
                </span>
              </div>
              <Progress value={stockAllocationPercent} className="mt-3 h-2 rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500" />
              </Progress>
              <p className="mt-3 text-xs text-slate-400">
                Long-term learning target: keep crypto exposure below 35% while you study volatility signals.
              </p>
            </div>
          </CardContent>
        </Card>
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
                  maskValues={hideBalances}
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
                  <div className="text-sm font-semibold text-cyan-200">
                    {maskValue(formatCurrency(bill.amount))}
                  </div>
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

    