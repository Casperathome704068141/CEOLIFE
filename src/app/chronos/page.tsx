'use client';

import { useMemo, useState } from 'react';
import { Clock4, Flame, Lock, Radar, ShieldCheck, Sparkles, Timer, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  ],
  medium: [
    { id: 'task-3', title: 'Prep weekly review briefing', duration: '30m' },
    { id: 'task-4', title: 'Draft outreach emails (5)', duration: '40m' },
  ],
  low: [
    { id: 'task-5', title: 'Hydration + walk', duration: '20m' },
    { id: 'task-6', title: 'Archive docs in Vault', duration: '25m' },
  ],
};

export default function CalendarPage() {
  const [energyOverlay, setEnergyOverlay] = useState(true);
  const [autoFitSuggested, setAutoFitSuggested] = useState(false);
  const [scheduledBlocks, setScheduledBlocks] = useState(demoBlocks);
  const [backlogState, setBacklogState] = useState(backlog);
  const [draggingTask, setDraggingTask] = useState<{ id: string; effort: keyof typeof backlog } | null>(null);

  const unifiedScore = useUnifiedLifeScore();

  const energyCurve = useMemo(() => [90, 80, 70, 60, 55, 45, 60, 70, 80, 65, 50, 40], []);

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
      const energyLevel = targetSlot.energy >= 75 ? 'high' : targetSlot.energy >= 55 ? 'medium' : 'low';
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Chronos Engine</p>
          <h1 className="text-2xl font-semibold text-white">Schedule // Energy Management</h1>
          <p className="text-sm text-slate-400">Drag backlog tasks onto time blocks. Protect what matters. Let Auto-Fit do the rest.</p>
          <p className="text-xs text-emerald-200">Unified Life Score input: {unifiedScore.score} · {unifiedScore.status}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full border-cyan-500/40 bg-cyan-500/10 text-cyan-200">
            <Lock className="mr-2 h-4 w-4" /> Protect Block
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
            <Radar className="mr-2 h-4 w-4" /> Energy Overlay
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-3 border border-slate-900/70 bg-slate-950/70">
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Energy Curve</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                <Zap className="h-4 w-4" /> Peak: 09:00
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs text-slate-400">
              <div className="rounded-xl bg-slate-900/70 p-2">Sleep Score 78</div>
              <div className="rounded-xl bg-slate-900/70 p-2">RHR 58</div>
              <div className="rounded-xl bg-slate-900/70 p-2">HRV 74</div>
              <div className="rounded-xl bg-slate-900/70 p-2">Meals synced</div>
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
              <div className="absolute bottom-2 left-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">Projected focus</div>
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
            <div className="relative h-[520px] overflow-hidden rounded-2xl border border-slate-900/80 bg-slate-950/70">
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
              <span>Task Backlog</span>
              <Button
                variant="ghost"
                className="h-8 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                onClick={() => setAutoFitSuggested(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" /> Auto-Optimize
              </Button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide">
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
            {autoFitSuggested && (
              <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-3 text-xs text-cyan-100">
                AI suggests scheduling "Design Corpus Engine cards" tomorrow 09:30 when energy is 88%.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
