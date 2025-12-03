'use client';

import { useMemo } from 'react';
import { briefingInsights } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatPercent } from '@/lib/ui/format';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bolt,
  Bot,
  CalendarClock,
  FileText,
  Flame,
  Inbox,
  Layers,
  LineChart,
  HeartPulse,
  Radar,
  Rocket,
  Sparkles,
  Target,
  Timer,
  Wallet,
} from 'lucide-react';
import { useUIState } from '@/store/ui-store';
import Link from 'next/link';
import { calculateUnifiedLifeScore } from '@/lib/hooks/useUnifiedLifeScore';
import { useOverview } from '@/lib/hooks/useOverview';
import { useGoals } from '@/lib/hooks/useGoals';
import { useEvents } from '@/lib/hooks/useEvents';
import { useDocuments } from '@/lib/hooks/useDocuments';
import { useShoppingLists } from '@/lib/hooks/useShoppingLists';

export default function DashboardPageContent() {
  const { overview, isLoading: overviewLoading } = useOverview();
  const { data: goals, loading: goalsLoading } = useGoals();
  const { data: events, loading: eventsLoading } = useEvents();
  const { data: documents, loading: documentsLoading } = useDocuments();
  const { data: shoppingLists, loading: shoppingListsLoading } = useShoppingLists();
  const loading = {
    overview: overviewLoading,
    goals: goalsLoading,
    events: eventsLoading,
    documents: documentsLoading,
    shoppingLists: shoppingListsLoading,
  };
  const { setCommandPaletteOpen } = useUIState();

  const unifiedScore = useMemo(
    () => calculateUnifiedLifeScore({ overview, goals, events }),
    [overview, goals, events]
  );
  const nextEvent = useMemo(() => events?.[0], [events]);
  const shoppingListItems = shoppingLists?.[0]?.items || [];

  const accentRing =
    unifiedScore.status === 'optimal'
      ? 'border-emerald-500/40'
      : unifiedScore.status === 'steady'
        ? 'border-sky-400/40'
        : 'border-amber-400/50';
  const accentBlur =
    unifiedScore.status === 'optimal'
      ? 'border-emerald-500/30'
      : unifiedScore.status === 'steady'
        ? 'border-sky-400/30'
        : 'border-amber-400/40';

  const capitalTiles = overview
    ? [
        { label: 'Net Worth', value: formatCurrency(overview.netWorth), delta: '+$4.3K', tone: 'up' },
        { label: 'Cash on Hand', value: formatCurrency(overview.cashOnHand.amount), delta: `${overview.cashOnHand.runwayDays}d runway`, tone: 'neutral' },
        { label: 'Monthly Burn', value: formatCurrency(overview.monthlyBurn.actual), delta: `${formatPercent(((overview.monthlyBurn.actual / Math.max(1, overview.monthlyBurn.target)) - 1) * 100)} vs target`, tone: 'down' },
      ]
    : [];

  const navLinks = [
    { label: 'Pulse', href: '/pulse', icon: HeartPulse },
    { label: 'Chronos', href: '/schedule/calendar', icon: Timer },
    { label: 'Finance Terminal', href: '/finance/overview', icon: Wallet },
    { label: 'Vault', href: '/vault', icon: Layers },
    { label: 'Simulations', href: '/simulations', icon: LineChart },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-900/70 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/60 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Unified navigation</p>
          <div className="flex flex-wrap items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-1 text-xs text-slate-200 transition hover:border-cyan-500/40 hover:text-white"
              >
                <link.icon className="h-4 w-4 text-cyan-300 transition group-hover:scale-110" /> {link.label}
                <ArrowRight className="h-3 w-3 text-slate-500 group-hover:text-cyan-300" />
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-medium text-white">
            <Activity className="h-4 w-4 text-emerald-300" /> Unified Life Score
            <span className="rounded-full border border-slate-800/60 bg-slate-950/80 px-2 py-0.5 text-xs text-emerald-200">
              {unifiedScore.status}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Auto-focus engines synced</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <LineChart className="h-4 w-4 text-cyan-300" /> Unified Life Score trajectory
            </CardTitle>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
              <span className="rounded-full border border-slate-800 px-2 py-1">Energy-aware</span>
              <span className="rounded-full border border-slate-800 px-2 py-1">Auto-balancing</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(unifiedScore.breakdown).map(([domain, score]) => (
                <div key={domain} className="space-y-1 rounded-2xl border border-slate-900 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
                    <span>{domain}</span>
                    <span className="text-slate-300">{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                  <p className="text-[12px] text-slate-400">Adaptive weights from runway, focus adherence, and mission progress.</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-300">
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-2 py-1">Next unlock: +2 pts if burn meets target</span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-2 py-1">Chronos synced with energy map</span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-2 py-1">Finance terminal review mode active</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <Target className="h-4 w-4 text-emerald-300" /> Command Stack
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            <p className="text-slate-400">Latest automations wired into the OS. Drag to reprioritize execution.</p>
            <div className="space-y-2">
              {[
                'Auto-fit backlog by energy curve',
                'Cashflow review mode pinned to Finance',
                'Pulse signals routed to Morning Brief',
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                  <span>{item}</span>
                  <Button size="sm" variant="ghost" className="h-8 rounded-full border border-slate-800 px-2 text-xs text-cyan-200">
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <Activity className="h-4 w-4 text-emerald-400" /> System Pulse
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <div className={`absolute inset-0 rounded-full border-4 ${accentRing}`} />
              <div className={`absolute inset-2 rounded-full border ${accentBlur} blur`} />
              <div className="text-4xl font-bold text-white">{unifiedScore.score}</div>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Unified Life Score</p>
              <p>Live composite from capital, time, health, and mission telemetry.</p>
              <div className="flex flex-wrap gap-2 text-[11px] uppercase text-slate-400">
                <span className="rounded-full border border-emerald-500/50 px-2 py-1">Finance {unifiedScore.breakdown.finance}%</span>
                <span className="rounded-full border border-emerald-500/50 px-2 py-1">Time {unifiedScore.breakdown.time}%</span>
                <span className="rounded-full border border-emerald-500/50 px-2 py-1">Health {unifiedScore.breakdown.health}%</span>
                <span className="rounded-full border border-emerald-500/50 px-2 py-1">Mission {unifiedScore.breakdown.mission}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <Wallet className="h-4 w-4 text-cyan-300" /> Capital Vital Signs
            </CardTitle>
            <Link href="/finance/overview" className="text-xs text-cyan-300">
              Open terminal
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {capitalTiles.length === 0 ? (
              <p className="text-sm text-slate-400">Syncing finance data...</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 text-sm">
                {capitalTiles.map((tile) => (
                  <div key={tile.label} className="rounded-2xl border border-slate-900 bg-slate-900/80 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{tile.label}</p>
                    <p className="text-lg font-semibold text-white">{tile.value}</p>
                    <p className="text-[11px] text-emerald-300">{tile.delta}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-cyan-200">
                <ArrowUpRight className="h-4 w-4" /> Net Worth trajectory ready for simulation.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <Rocket className="h-4 w-4 text-amber-300" /> Action Hub
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            <p className="text-slate-400">Fire off the next action without hunting for the right tab.</p>
            <div className="grid grid-cols-2 gap-2">
              <Button className="h-10 rounded-2xl bg-cyan-600 text-white" onClick={() => setCommandPaletteOpen(true)}>
                Cmd + K · Inject
              </Button>
              <Button variant="secondary" className="h-10 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
                Run Simulation
              </Button>
              <Button variant="ghost" className="h-10 rounded-2xl border border-slate-800 bg-slate-900/70 text-slate-100">
                Send Nudge
              </Button>
              <Button variant="outline" className="h-10 rounded-2xl border-amber-500/50 bg-amber-500/10 text-amber-200">
                Review Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <Bot className="h-4 w-4 text-cyan-300" /> Morning Brief
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            {briefingInsights.slice(0, 3).map((insight) => (
              <div key={insight.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{insight.title}</p>
                <p className="text-slate-200">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <CalendarClock className="h-4 w-4 text-emerald-300" /> Next Protected Block
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            {loading.events ? (
              <p className="text-slate-400">Loading schedule...</p>
            ) : nextEvent ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  <Flame className="h-4 w-4 text-amber-300" /> High Focus Window
                </div>
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <p className="text-lg font-semibold text-white">{nextEvent.title}</p>
                  <p className="text-xs text-emerald-200">
                    {(nextEvent.start as any)?.toDate?.().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} –{' '}
                    {(nextEvent.end as any)?.toDate?.().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  <p className="text-[12px] text-slate-300">Logged focus after completion to train Chronos.</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">No protected blocks scheduled today.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <Inbox className="h-4 w-4 text-amber-300" /> Logistics Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            {loading.shoppingLists ? (
              <p className="text-slate-400">Checking household inventory…</p>
            ) : shoppingListItems.length ? (
              shoppingListItems.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-amber-200">Below threshold · added to backlog</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400">All inventory is above threshold.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <FileText className="h-4 w-4 text-cyan-300" /> Knowledge Trace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            {loading.documents ? (
              <p className="text-slate-400">Syncing vault…</p>
            ) : documents?.length ? (
              documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="font-semibold text-white">{doc.filename}</p>
                  <p className="text-xs text-slate-400">Tagged: {(doc.tags || []).join(', ') || 'unlabeled'}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400">Drop a document to kick off OCR + routing.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <Bolt className="h-4 w-4 text-emerald-300" /> Active Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            {loading.goals ? (
              <p className="text-slate-400">Loading goals…</p>
            ) : goals?.length ? (
              goals.slice(0, 3).map((goal) => {
                const percent = Math.min(100, Math.round((goal.current / Math.max(goal.target || 1, 1)) * 100));
                return (
                  <div key={goal.id} className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-semibold text-white">{goal.name}</p>
                      <span className="text-xs text-slate-400">Due {(goal.deadline as any)?.toDate?.().toLocaleDateString?.() || 'TBD'}</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                    <p className="text-xs text-emerald-200">{percent}% toward {formatCurrency(goal.target)}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400">No active goals tracked.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <Bell className="h-4 w-4 text-cyan-300" /> System Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-200">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-xs font-mono text-slate-300">
              <p>[SYNC] Finance terminal pulled 245 transactions.</p>
              <p>[COPILOT] Suggested rescheduling Deep Work to 10:00.</p>
              <p>[LOGISTICS] Added task "Buy milk" from inventory alert.</p>
              <p>[VAULT] OCR complete for lease.pdf → dates injected.</p>
            </div>
            <Button variant="ghost" className="h-9 rounded-full border border-slate-800 bg-slate-900/70 text-cyan-200">
              View full log stream
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
