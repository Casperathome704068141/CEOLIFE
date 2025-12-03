'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Activity,
  AlarmClockCheck,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock4,
  Flame,
  HeartPulse,
  LayoutDashboard,
  Link2,
  Lock,
  MapPin,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  Timer,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useUnifiedLifeScore } from '@/lib/hooks/useUnifiedLifeScore';

const hours = Array.from({ length: 12 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

const demoBlocks = [
  { id: 'block-1', title: 'Deep Work: Product Spec', start: '09:00', end: '11:00', energy: 'high', protected: true },
  { id: 'block-2', title: 'Finance Sync', start: '13:00', end: '14:00', energy: 'medium', protected: false },
  { id: 'block-3', title: 'Inbox Zero', start: '16:00', end: '17:00', energy: 'low', protected: false },
];

const backlog = {
  high: [
    { id: 'task-1', title: 'Design Corpus Engine cards', duration: '90m' },
    { id: 'task-2', title: 'Refine investment sweep rule', duration: '45m' },
    { id: 'task-7', title: 'Navigator brief for mission week', duration: '50m' },
  ],
  medium: [
    { id: 'task-3', title: 'Prep weekly review briefing', duration: '30m' },
    { id: 'task-4', title: 'Draft outreach emails (5)', duration: '40m' },
    { id: 'task-8', title: 'Habitat sync with captain', duration: '25m' },
  ],
  low: [
    { id: 'task-5', title: 'Hydration + walk', duration: '20m' },
    { id: 'task-6', title: 'Archive docs in Vault', duration: '25m' },
    { id: 'task-9', title: 'Reset workspace surfaces', duration: '15m' },
  ],
};

const connectors = [
  { id: 'conn-1', name: 'Mission Dashboard', path: '/dashboard', status: 'Stable', signal: 98 },
  { id: 'conn-2', name: 'Habitat', path: '/habitat', status: 'Green', signal: 95 },
  { id: 'conn-3', name: 'Vault', path: '/vault', status: 'Locked', signal: 91 },
  { id: 'conn-4', name: 'Simulations', path: '/simulations', status: 'Synced', signal: 93 },
];

const protocols = [
  'Protect high-energy blocks first; never override without approval.',
  'Sync Chronos -> Corpus Engine cards hourly; log deferrals.',
  'Surface conflicts with Habitat commitments inside Time-Block Grid.',
];

export default function CalendarPage() {
  const [energyOverlay, setEnergyOverlay] = useState(true);
  const [autoFitSuggested, setAutoFitSuggested] = useState(false);
  const [scheduledBlocks, setScheduledBlocks] = useState(demoBlocks);
  const [backlogState, setBacklogState] = useState(backlog);
  const [draggingTask, setDraggingTask] = useState<{ id: string; effort: keyof typeof backlog } | null>(null);

  const unifiedScore = useUnifiedLifeScore();

  const energyCurve = useMemo(() => [92, 86, 75, 64, 58, 52, 62, 74, 81, 70, 58, 45], []);

  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const durationToMinutes = (duration: string) => Number(duration.replace('m', '')) || 30;

  const addBlock = (time: string, taskId: string, effort: keyof typeof backlog) => {
    const task = backlogState[effort].find((item) => item.id === taskId);
    if (!task) return;
    const startMinutes = toMinutes(time);
    const durationMinutes = durationToMinutes(task.duration);
    const endMinutes = startMinutes + durationMinutes;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    setScheduledBlocks((prev) => [
      ...prev,
      {
        id: `${task.id}-${time}`,
        title: task.title,
        start: time,
        end: endTime,
        energy: effort,
        protected: effort === 'high',
      },
    ]);

    setBacklogState((prev) => ({
      ...prev,
      [effort]: prev[effort].filter((item) => item.id !== taskId),
    }));
  };

  const scheduleStats = useMemo(() => {
    const protectedCount = scheduledBlocks.filter((block) => block.protected).length;
    const minutesScheduled = scheduledBlocks.reduce((total, block) => total + (toMinutes(block.end) - toMinutes(block.start)), 0);
    const energySpread = scheduledBlocks.reduce(
      (acc, block) => ({ ...acc, [block.energy]: (acc[block.energy] || 0) + 1 }),
      { high: 0, medium: 0, low: 0 } as Record<string, number>,
    );

    return { protectedCount, minutesScheduled, energySpread };
  }, [scheduledBlocks]);

  const handleAutoFit = () => {
    const slots = hours.slice(0, energyCurve.length).map((h, idx) => ({ hour: h, energy: energyCurve[idx] }));
    const tasks = Object.entries(backlogState)
      .flatMap(([effort, items]) => items.map((item) => ({ ...item, effort: effort as keyof typeof backlog })))
      .sort((a, b) => durationToMinutes(b.duration) - durationToMinutes(a.duration));

    const protectedBlocks = scheduledBlocks.filter((block) => block.protected);
    const nextSchedule: typeof scheduledBlocks = [...protectedBlocks];

    tasks.forEach((task, index) => {
      const targetSlot = slots[index % slots.length];
      if (!targetSlot) return;
      const energyLevel = targetSlot.energy >= 75 ? 'high' : targetSlot.energy >= 60 ? 'medium' : 'low';
      const startMinutes = toMinutes(targetSlot.hour);
      const durationMinutes = durationToMinutes(task.duration);
      const endMinutes = startMinutes + durationMinutes;
      const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;
      nextSchedule.push({
        id: `${task.id}-${targetSlot.hour}`,
        title: task.title,
        start: targetSlot.hour,
        end: endTime,
        energy: energyLevel,
        protected: energyLevel === 'high',
      });
    });

    setScheduledBlocks(nextSchedule);
    setBacklogState({ high: [], medium: [], low: [] });
    setAutoFitSuggested(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Chronos Engine</p>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-white">Mission Control // Time & Energy</h1>
            <Badge className="rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-100">Flight-ready</Badge>
          </div>
          <p className="text-sm text-slate-400">
            Command-grade cockpit for time-blocking, energy-aware scheduling, and real-time sync with the rest of your life stack.
            Drag backlog tasks, protect high-value windows, and let Auto-Fit align the day to the energy curve.
          </p>
          <p className="text-xs text-emerald-200">Unified Life Score input: {unifiedScore.score} · {unifiedScore.status}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="rounded-full border-slate-800 bg-slate-900/70 text-slate-100">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full border border-slate-800 bg-slate-950/80 text-slate-100">
            <Link href="/habitat">
              <MapPin className="mr-2 h-4 w-4" /> Habitat sync
            </Link>
          </Button>
          <Button
            variant="secondary"
            className="rounded-full bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
            onClick={handleAutoFit}
          >
            <Sparkles className="mr-2 h-4 w-4" /> Auto-Fit
          </Button>
          <Button
            variant="ghost"
            className="rounded-full border border-slate-700/80 bg-slate-900/70 text-slate-100"
            onClick={() => setEnergyOverlay((prev) => !prev)}
          >
            <Radar className="mr-2 h-4 w-4" /> {energyOverlay ? 'Hide' : 'Show'} Energy Overlay
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
              <Rocket className="h-4 w-4 text-emerald-300" /> Chronos status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-100">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
              <span>Protected</span>
              <span>{scheduleStats.protectedCount}</span>
            </div>
            <Progress value={Math.min(100, (scheduleStats.protectedCount / Math.max(1, scheduledBlocks.length)) * 100)} />
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-300" /> No overrides permitted without sign-off.
            </div>
            <Separator className="border-slate-800" />
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-2 text-slate-200">
                <Timer className="h-4 w-4 text-cyan-300" /> Minutes committed
              </span>
              <span className="font-mono text-emerald-200">{scheduleStats.minutesScheduled}m</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
              <Activity className="h-4 w-4 text-cyan-300" /> Energy utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>High</span>
              <Badge className="rounded-full bg-emerald-500/20 text-emerald-100">{scheduleStats.energySpread.high}</Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Medium</span>
              <Badge className="rounded-full bg-amber-500/20 text-amber-100">{scheduleStats.energySpread.medium}</Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Low</span>
              <Badge className="rounded-full bg-slate-700 text-slate-100">{scheduleStats.energySpread.low}</Badge>
            </div>
            <p className="text-[11px] text-slate-500">Keep high-output tasks within the 07:30-11:00 band.</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
              <Brain className="h-4 w-4 text-amber-300" /> Unified life feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-100">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
              <span>Score</span>
              <span className="text-emerald-200">{unifiedScore.score}</span>
            </div>
            <Progress value={Math.min(100, Number(unifiedScore.score))} />
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-2 text-[11px] text-slate-300">
              {unifiedScore.status} · Chronos consumes this feed every hour to adjust task load.
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
              <AlarmClockCheck className="h-4 w-4 text-rose-300" /> Next action
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-100">
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">T-42m</p>
                <p className="text-sm font-semibold text-white">Deep Work: Product Spec</p>
                <p className="text-[12px] text-slate-400">Lock distractions · hydrate · dim alerts</p>
              </div>
              <Lock className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Auto-sync back to Vault after completion.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-3 border border-slate-900/70 bg-slate-950/70">
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Energy curve</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                <Zap className="h-4 w-4" /> Peak: 09:00
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs text-slate-400">
              <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-2">Sleep Score 78</div>
              <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-2">HRV 74</div>
              <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-2">RHR 58</div>
              <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-2">Meals synced</div>
            </div>
            <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-900/80 bg-slate-950/80">
              <div className="absolute inset-0 flex items-end gap-1 px-3 pb-3">
                {energyCurve.map((value, idx) => (
                  <div
                    key={idx}
                    className="w-full rounded-t bg-gradient-to-t from-cyan-500/10 via-cyan-400/30 to-emerald-400/40"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />
              <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                <Activity className="h-3 w-3 text-emerald-300" /> Projected focus
              </div>
            </div>
            <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-3 text-[11px] text-slate-400">
              If HRV &lt; 60, lower task density and re-run Auto-Fit. Chronos will prompt for recovery windows.
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-6 border border-slate-900/70 bg-slate-950/80">
          <CardContent className="relative h-full space-y-3 p-4">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-slate-400">
              <span>Time-Block Grid</span>
              <span className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck className="h-4 w-4" /> Protected blocks respected
              </span>
            </div>
            <div className="relative h-[560px] overflow-hidden rounded-2xl border border-slate-900/80 bg-slate-950/70">
              {energyOverlay && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-amber-500/10 to-rose-500/15" />
              )}
              <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
                <div className="relative flex flex-col border-r border-slate-900/60 p-4">
                  {hours.map((hour) => {
                    const blocks = scheduledBlocks.filter((block) => block.start === hour);
                    return (
                      <div
                        key={hour}
                        className="flex items-start gap-3 border-b border-slate-900/60 py-2 text-xs text-slate-500 last:border-b-0"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => draggingTask && addBlock(hour, draggingTask.id, draggingTask.effort)}
                      >
                        <span className="w-12 text-right font-mono">{hour}</span>
                        <div className="flex-1 space-y-2 rounded-xl border border-dashed border-slate-800/70 p-2 text-[11px] text-slate-600">
                          {blocks.length === 0 ? 'Free slot' : null}
                          {blocks.map((block) => (
                            <div
                              key={block.id}
                              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-2 text-slate-100 shadow-[0_6px_20px_rgba(14,165,233,0.15)]"
                            >
                              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-cyan-200">
                                <span>
                                  {block.start} - {block.end}
                                </span>
                                <span className="flex items-center gap-1 text-emerald-300">
                                  <Flame className="h-3 w-3" /> {block.energy}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-white">{block.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="relative hidden flex-col border-l border-slate-900/60 p-4 md:flex">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <Clock4 className="h-4 w-4 text-amber-300" /> Drag a backlog task into a slot to schedule.
                    </span>
                    <span className="rounded-full border border-slate-800 px-2 py-1 text-[10px] text-slate-400">Energy matched</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {scheduledBlocks.map((block) => (
                      <div
                        key={block.id}
                        className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm text-slate-50 shadow-[0_10px_30px_rgba(14,165,233,0.15)]"
                      >
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-cyan-200">
                          <span>
                            {block.start} - {block.end}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-300">
                            <Flame className="h-3 w-3" /> {block.energy}
                          </span>
                        </div>
                        <p className="mt-1 text-base font-semibold text-white">{block.title}</p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                          {block.protected ? (
                            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-emerald-200">Protected</span>
                          ) : (
                            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-amber-200">Mutable</span>
                          )}
                          <span className="rounded-full border border-slate-800 px-2 py-1">Complete & Log</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-4 bottom-3 flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-2 text-[11px] text-slate-300">
              <span className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-cyan-300" /> Next protected block in 42m
              </span>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-emerald-200">Energy optimal</span>
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-amber-200">Conflict risk low</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-3 border border-slate-900/70 bg-slate-950/70">
          <CardContent className="flex h-full flex-col gap-4 p-4">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-slate-500">
              <span>Task backlog</span>
              <Button
                variant="ghost"
                className="h-8 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                onClick={() => setAutoFitSuggested(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" /> Auto-Optimize
              </Button>
            </div>
            <ScrollArea className="h-[360px] pr-2">
              <div className="space-y-4">
                {Object.entries(backlogState).map(([effort, tasks]) => (
                  <div key={effort} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-slate-500" /> {effort} effort
                    </div>
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={() => setDraggingTask({ id: task.id, effort: effort as keyof typeof backlog })}
                          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-100 shadow-inner shadow-slate-900"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{task.title}</p>
                            <span className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-300">{task.duration}</span>
                          </div>
                          <p className="mt-1 text-[12px] text-slate-400">Drag to grid to acknowledge time cost.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {autoFitSuggested && (
              <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-3 text-xs text-cyan-100">
                AI suggests scheduling "Design Corpus Engine cards" tomorrow 09:30 when energy is 88%. Habits and Vault deadlines already reconciled.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
              <Link2 className="h-4 w-4 text-cyan-300" /> Connectivity map
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-100">
            {connectors.map((connector) => (
              <div key={connector.id} className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/80 p-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">{connector.status}</p>
                  <p className="text-base font-semibold text-white">{connector.name}</p>
                  <p className="text-[12px] text-slate-400">Signal {connector.signal}% · Two-way sync guaranteed</p>
                </div>
                <Button asChild variant="ghost" className="rounded-full border border-slate-800 bg-slate-900/70 text-slate-100">
                  <Link href={connector.path}>
                    Open <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
              <HeartPulse className="h-4 w-4 text-emerald-300" /> Flight rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-100">
            {protocols.map((protocol) => (
              <div key={protocol} className="flex items-center gap-3 rounded-xl border border-slate-900 bg-slate-950/80 p-3">
                <Lock className="h-4 w-4 text-emerald-300" />
                <p className="text-[13px] text-slate-200">{protocol}</p>
              </div>
            ))}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
              If Habitat adds a new event, Chronos blocks time automatically and sends a Vault receipt.
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-900/70 bg-slate-950/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
              <Activity className="h-4 w-4 text-cyan-300" /> Autopilot console
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-100">
            <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-3">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-slate-500">
                <span>Pending</span>
                <span>03</span>
              </div>
              <p className="text-base font-semibold text-white">Reconcile backlog with energy curve</p>
              <p className="text-[12px] text-slate-400">Auto-Fit pending approval · No conflicts detected with Habitat.</p>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/80 p-3">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Signal</p>
                <p className="text-sm text-slate-200">Chronos -&gt; Vault logging</p>
                <p className="text-[12px] text-slate-400">All completed tasks get a Vault record & Corpus tag.</p>
              </div>
              <Button variant="outline" className="rounded-full border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
                Acknowledge
              </Button>
            </div>
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-[12px] text-cyan-100">
              Chronos is connected to Space-grade telemetry: HRV, sleep, and ambient noise. Adaptive throttling active.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
