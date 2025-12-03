'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BrainCircuit, Clock3, GripVertical, RefreshCw, ShieldAlert, Target } from 'lucide-react';
import { ChronosBacklogItem, ChronosSchedule, ChronosScheduleBlock } from '@/lib/api/chronos';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 - 21:00
const QUARTERS = [0, 15, 30, 45];
const HOUR_HEIGHT = 128;

type CollisionWarning = {
  id: string;
  message: string;
  severity: 'caution' | 'critical';
};

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const normalized = hours % 12 === 0 ? 12 : hours % 12;
  return `${normalized}:${mins.toString().padStart(2, '0')} ${suffix}`;
}

function getCategoryHue(category: ChronosScheduleBlock['category']) {
  switch (category) {
    case 'Deep Work':
      return 'amber';
    case 'Maintenance':
      return 'emerald';
    case 'Admin':
      return 'sky';
    case 'Recovery':
      return 'rose';
    default:
      return 'cyan';
  }
}

function categoryStyles(category: ChronosScheduleBlock['category']) {
  const hue = getCategoryHue(category);
  const palette: Record<string, { border: string; bg: string; text: string }> = {
    amber: {
      border: 'border-amber-500',
      bg: 'from-amber-500/15',
      text: 'text-amber-50',
    },
    emerald: {
      border: 'border-emerald-500',
      bg: 'from-emerald-500/10',
      text: 'text-emerald-50',
    },
    sky: {
      border: 'border-sky-500',
      bg: 'from-sky-500/10',
      text: 'text-sky-50',
    },
    rose: {
      border: 'border-rose-500',
      bg: 'from-rose-500/15',
      text: 'text-rose-50',
    },
    cyan: {
      border: 'border-cyan-500',
      bg: 'from-cyan-500/10',
      text: 'text-cyan-50',
    },
  };

  return palette[hue];
}

function deriveSlotsFromSchedule(blocks: ChronosScheduleBlock[]) {
  return blocks
    .slice()
    .sort((a, b) => a.startMinutes - b.startMinutes)
    .reduce<ChronosScheduleBlock[]>((acc, block) => {
      acc.push(block);
      return acc;
    }, []);
}

function computeCollision(newBlock: ChronosScheduleBlock, schedule: ChronosScheduleBlock[]): CollisionWarning | null {
  const ordered = deriveSlotsFromSchedule(schedule);
  const prior = ordered
    .filter((b) => b.startMinutes < newBlock.startMinutes)
    .sort((a, b) => b.startMinutes - a.startMinutes)[0];
  if (!prior) return null;

  const gap = newBlock.startMinutes - (prior.startMinutes + prior.durationMinutes);
  const highEnergy = newBlock.energyCost >= 8 && prior.energyCost >= 8;
  if (gap <= 20 && highEnergy) {
    return {
      id: `${prior.id}-${newBlock.id}`,
      severity: 'critical',
      message: 'Warning: Cognitive Fatigue likely. Insert 15m recovery protocol?',
    };
  }
  if (gap <= 45 && highEnergy) {
    return {
      id: `${prior.id}-${newBlock.id}`,
      severity: 'caution',
      message: 'Structural Integrity: Consider a buffer before the next burn.',
    };
  }
  return null;
}

export function ChronosInterface({ initialSchedule, initialBacklog }: { initialSchedule: ChronosSchedule; initialBacklog: ChronosBacklogItem[] }) {
  const [backlog, setBacklog] = useState<ChronosBacklogItem[]>(initialBacklog);
  const [schedule, setSchedule] = useState<ChronosScheduleBlock[]>(initialSchedule.blocks);
  const [dragging, setDragging] = useState<ChronosBacklogItem | null>(null);
  const [warning, setWarning] = useState<CollisionWarning | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  const orderedSchedule = useMemo(() => deriveSlotsFromSchedule(schedule), [schedule]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startMinutes = HOURS[0] * 60;
  const endMinutes = (HOURS[HOURS.length - 1] + 1) * 60;
  const currentMinutes = Math.min(Math.max(now.getHours() * 60 + now.getMinutes(), startMinutes), endMinutes);
  const laserOffset = ((currentMinutes - startMinutes) / 60) * HOUR_HEIGHT;

  const handleDrop = (slotMinutes: number) => {
    if (!dragging) return;
    const newBlock: ChronosScheduleBlock = {
      id: `sched-${Date.now()}`,
      title: dragging.title,
      startMinutes: slotMinutes,
      durationMinutes: dragging.durationMinutes,
      energyCost: dragging.energyCost,
      category: dragging.category,
      intent: `${dragging.category} payload slotted from hangar`,
    };

    const newSchedule = [...schedule, newBlock];
    setSchedule(newSchedule);
    setBacklog((prev) => prev.filter((item) => item.id !== dragging.id));

    const collision = computeCollision(newBlock, schedule);
    if (collision) {
      setWarning(collision);
      setTimeout(() => setWarning(null), 5000);
    }
    setDragging(null);
  };

  const findAvailableWindows = () => {
    const sorted = deriveSlotsFromSchedule(schedule);
    const windows: Array<{ start: number; end: number }> = [];
    let cursor = startMinutes;

    sorted.forEach((block) => {
      if (block.startMinutes > cursor) {
        windows.push({ start: cursor, end: block.startMinutes });
      }
      cursor = Math.max(cursor, block.startMinutes + block.durationMinutes);
    });

    if (cursor < endMinutes) {
      windows.push({ start: cursor, end: endMinutes });
    }
    return windows;
  };

  const handleAutoFit = () => {
    const windows = findAvailableWindows();
    let pending = [...backlog].sort((a, b) => b.priority - a.priority || b.energyCost - a.energyCost);
    const placed: ChronosScheduleBlock[] = [];

    windows.forEach((window) => {
      let cursor = window.start;
      pending = pending.filter((task) => {
        const fits = cursor + task.durationMinutes <= window.end;
        if (fits) {
          placed.push({
            id: `sched-auto-${task.id}`,
            title: task.title,
            startMinutes: cursor,
            durationMinutes: task.durationMinutes,
            energyCost: task.energyCost,
            category: task.category,
            intent: 'Auto-fit deployment based on priority and energy profile',
          });
          cursor += task.durationMinutes + 5; // micro-buffer
          return false;
        }
        return true;
      });
    });

    if (placed.length) {
      const updated = deriveSlotsFromSchedule([...schedule, ...placed]);
      setSchedule(updated);
      setBacklog(pending);
    }
  };

  const currentBlock = orderedSchedule.find(
    (block) => currentMinutes >= block.startMinutes && currentMinutes <= block.startMinutes + block.durationMinutes,
  );

  useEffect(() => {
    if (currentBlock) {
      document.title = `${currentBlock.title} | CHRONOS`;
    }
  }, [currentBlock]);

  return (
    <div className="grid grid-cols-12 h-full divide-x divide-slate-800">
      <aside className="col-span-3 bg-[#080808] flex flex-col border-r border-slate-800">
        <div className="p-3 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Payload Manifest</h2>
          <button className="p-1 hover:bg-slate-800 rounded text-slate-500" aria-label="Refresh backlog">
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>

        <div className="flex p-2 gap-1 bg-slate-900/30">
          {['Tasks', 'Routines', 'Goals'].map((tab) => (
            <button
              key={tab}
              className="flex-1 py-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-400 hover:bg-slate-800 hover:text-white rounded transition-colors"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
          {backlog.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => setDragging(task)}
              onDragEnd={() => setDragging(null)}
              className={cn(
                'group relative flex items-center gap-3 p-3 rounded border border-slate-800 bg-[#0F0F10] hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] cursor-grab active:cursor-grabbing transition-all',
                dragging?.id === task.id && 'border-cyan-500/70 ring-1 ring-cyan-500/50',
              )}
            >
              <GripVertical className="h-3 w-3 text-slate-600 group-hover:text-slate-400" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium text-slate-200 group-hover:text-cyan-200 transition-colors">{task.title}</p>
                  <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1 rounded border border-slate-800">{task.durationMinutes}m</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={cn('h-1.5 w-1.5 rounded-full', {
                      'bg-amber-500': task.category === 'Deep Work',
                      'bg-emerald-500': task.category === 'Maintenance',
                      'bg-sky-500': task.category === 'Admin',
                      'bg-rose-500': task.category === 'Recovery',
                    })}
                  />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Energy {task.energyCost}/10</span>
                </div>
              </div>
            </div>
          ))}

          {!backlog.length && (
            <div className="text-[11px] text-slate-500 text-center py-4 border border-dashed border-slate-800 rounded">
              All payloads are locked in. Stand by.
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-900/50">
          <input
            type="text"
            placeholder="Cmd+N to add payload..."
            className="w-full bg-[#050505] border border-slate-700 rounded px-3 py-2 text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </aside>

      <section className="col-span-6 bg-[#050505] relative flex flex-col">
        <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950/50">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-white font-mono">{initialSchedule.dateLabel}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ON TRAJECTORY
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAutoFit}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyan-600/10 border border-cyan-600/30 text-cyan-400 text-[10px] font-bold uppercase hover:bg-cyan-600/20 transition-all"
            >
              <BrainCircuit className="h-3 w-3" /> Auto-Fit
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-800">
          <div className="absolute left-0 right-0 z-30 pointer-events-none" style={{ top: laserOffset }}>
            <div className="border-t border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)] relative">
              <span className="absolute -top-2.5 left-2 text-[9px] font-bold bg-rose-500 text-black px-1.5 py-0.5 rounded-sm font-mono">
                {now.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {HOURS.map((hour) => (
            <div key={hour} className="h-32 border-b border-slate-900/60 flex group relative">
              <div className="w-14 shrink-0 border-r border-slate-900/60 text-[10px] text-slate-600 p-2 font-mono text-right">
                {hour}:00
              </div>
              <div className="flex-1 relative p-1 group-hover:bg-slate-900/20 transition-colors">
                {orderedSchedule
                  .filter((block) => block.startMinutes >= hour * 60 && block.startMinutes < (hour + 1) * 60)
                  .map((block) => {
                    const offset = ((block.startMinutes - hour * 60) / 60) * HOUR_HEIGHT;
                    const height = (block.durationMinutes / 60) * HOUR_HEIGHT;
                    const palette = categoryStyles(block.category);
                    const isActive = currentBlock?.id === block.id;
                    return (
                      <div
                        key={block.id}
                        className={cn(
                          'absolute left-1 right-1 rounded-sm border-l-2 bg-gradient-to-r to-transparent p-3 transition-all cursor-pointer shadow-[0_0_20px_rgba(14,165,233,0.05)]',
                          palette.border,
                          palette.bg,
                          palette.text,
                          isActive && 'ring-2 ring-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.15)]',
                        )}
                        style={{ top: offset, height }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold">{block.title}</span>
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                          </span>
                        </div>
                        <p className="text-[10px] text-white/70 font-mono">{block.intent}</p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-white/60">
                          <Clock3 className="h-3 w-3" /> {formatTime(block.startMinutes)} · {block.durationMinutes}m
                          {block.linkTo && (
                            <Link href={block.linkTo} className="underline decoration-dotted">
                              Jump
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}

                <div className="grid grid-cols-4 gap-1 h-full">
                  {QUARTERS.map((quarter) => (
                    <div
                      key={quarter}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(hour * 60 + quarter)}
                      className="relative border border-dashed border-slate-900/40 rounded-sm hover:border-cyan-500/50 transition-colors"
                    >
                      <span className="absolute bottom-1 right-1 text-[8px] text-slate-700">+{quarter.toString().padStart(2, '0')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="col-span-3 bg-[#080808] border-l border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <Target className="h-3 w-3" /> Mission Objectives
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded border border-slate-800 bg-slate-900/30 relative overflow-hidden">
              <div className="flex justify-between text-xs mb-2 relative z-10">
                <span className="text-white font-bold">Launch MVP</span>
                <span className="text-emerald-400 font-mono">{Math.round(initialSchedule.goalVelocity * 100)}%</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-2 relative z-10">
                <div className="h-full bg-emerald-500" style={{ width: `${initialSchedule.goalVelocity * 100}%` }} />
              </div>
            </div>

            <div className="p-4 rounded border border-slate-800 bg-slate-900/30">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white font-bold">Marathon Prep</span>
                <span className="text-rose-400 font-mono">BEHIND</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                <div className="h-full w-[40%] bg-rose-500" />
              </div>
              <div className="flex items-center gap-2 mt-3 p-2 rounded bg-rose-950/30 border border-rose-900/50">
                <AlertTriangle className="h-3 w-3 text-rose-500" />
                <span className="text-[10px] text-rose-300">Missed 2 sessions. Re-calibrate?</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-800 bg-slate-900/20">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>Collision Detection</span>
            </div>
            {warning ? <span className="text-amber-300 font-semibold">{warning.severity.toUpperCase()}</span> : <span className="text-emerald-400">Nominal</span>}
          </div>
          {warning && (
            <div className="mt-3 p-3 rounded border border-amber-500/40 bg-amber-500/5 text-[11px] text-amber-100">
              {warning.message}
            </div>
          )}
        </div>

        <div className="mt-auto p-6 bg-slate-900/20 border-t border-slate-800 text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full border-4 border-cyan-900/50 bg-slate-950 relative">
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-mono">{Math.round(initialSchedule.dayUtility * 100)}%</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">Day Utility</div>
            </div>
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-cyan-500"
                strokeWidth="4"
                strokeDasharray="251"
                strokeDashoffset={`${251 - initialSchedule.dayUtility * 251}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-slate-400">
            <div className="p-2 rounded border border-slate-800 bg-slate-950/60">
              <div className="text-slate-200 font-semibold">{initialSchedule.focusDuration.toFixed(1)}h</div>
              <div className="uppercase tracking-widest text-[9px]">Focus</div>
            </div>
            <div className="p-2 rounded border border-slate-800 bg-slate-950/60">
              <div className="text-slate-200 font-semibold">{Math.round(initialSchedule.contextSwitchPenalty * 100)}%</div>
              <div className="uppercase tracking-widest text-[9px]">Context</div>
            </div>
            <div className="p-2 rounded border border-slate-800 bg-slate-950/60">
              <div className="text-slate-200 font-semibold">{Math.round(initialSchedule.goalVelocity * 100)}%</div>
              <div className="uppercase tracking-widest text-[9px]">Velocity</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
