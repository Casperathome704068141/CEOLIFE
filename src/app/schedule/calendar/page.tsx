"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import type { ReactNode } from "react";
import {
  PageHeader,
  PagePrimaryAction,
  PageSecondaryAction,
} from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  AlarmClock,
  ArrowRight,
  Bell,
  BellRing,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Filter,
  FileText,
  Link as LinkIcon,
  Loader2,
  MapPin,
  Pill,
  Plus,
  Repeat,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type CalendarView = "Day" | "Week" | "Month";

type EventCategory =
  | "Personal"
  | "Finance"
  | "Care"
  | "Household"
  | "Wellness"
  | "Automations"
  | "Google";

type LinkedEntity =
  | { type: "bill"; name: string; amount: string; due: string }
  | { type: "document"; name: string; updated: string }
  | { type: "medication"; name: string; dose: string }
  | { type: "routine"; name: string; cadence: string };

interface TimelineEvent {
  id: string;
  title: string;
  category: EventCategory;
  start: string;
  end: string;
  location?: string;
  description?: string;
  source: "Beno" | "Google" | "Automation";
  requiresConfirmation?: boolean;
  canComplete?: boolean;
  links?: LinkedEntity[];
}

const CATEGORY_STYLES: Record<
  EventCategory,
  { chip: string; dot: string; legend: string }
> = {
  Personal: {
    chip:
      "border-indigo-400/60 bg-indigo-500/20 text-indigo-50 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.65)]",
    dot: "bg-indigo-400",
    legend: "bg-indigo-500",
  },
  Finance: {
    chip:
      "border-cyan-400/60 bg-cyan-500/20 text-cyan-50 shadow-[0_8px_30px_-12px_rgba(34,211,238,0.65)]",
    dot: "bg-cyan-400",
    legend: "bg-cyan-500",
  },
  Care: {
    chip:
      "border-emerald-400/60 bg-emerald-500/20 text-emerald-50 shadow-[0_8px_30px_-12px_rgba(16,185,129,0.65)]",
    dot: "bg-emerald-400",
    legend: "bg-emerald-500",
  },
  Household: {
    chip:
      "border-amber-400/60 bg-amber-500/20 text-amber-50 shadow-[0_8px_30px_-12px_rgba(245,158,11,0.65)]",
    dot: "bg-amber-400",
    legend: "bg-amber-500",
  },
  Wellness: {
    chip:
      "border-purple-400/60 bg-purple-500/20 text-purple-50 shadow-[0_8px_30px_-12px_rgba(168,85,247,0.65)]",
    dot: "bg-purple-400",
    legend: "bg-purple-500",
  },
  Automations: {
    chip:
      "border-rose-400/60 bg-rose-500/20 text-rose-50 shadow-[0_8px_30px_-12px_rgba(244,63,94,0.65)]",
    dot: "bg-rose-400",
    legend: "bg-rose-500",
  },
  Google: {
    chip:
      "border-slate-500/60 bg-slate-500/20 text-slate-100 shadow-[0_8px_30px_-12px_rgba(148,163,184,0.65)]",
    dot: "bg-slate-400",
    legend: "bg-slate-500",
  },
};

const RAW_EVENTS: TimelineEvent[] = [
  {
    id: "evt-1",
    title: "Founder standup",
    category: "Personal",
    start: "2024-06-24T08:30:00",
    end: "2024-06-24T09:15:00",
    location: "War room",
    description: "Weekly sync with Emma & product leads.",
    source: "Beno",
    links: [{ type: "document", name: "Standup brief", updated: "Today 6:45a" }],
  },
  {
    id: "evt-2",
    title: "Therapy",
    category: "Wellness",
    start: "2024-06-24T10:00:00",
    end: "2024-06-24T11:00:00",
    location: "Dr. Thompson (virtual)",
    source: "Google",
    canComplete: true,
  },
  {
    id: "evt-3",
    title: "Payroll review",
    category: "Finance",
    start: "2024-06-24T11:15:00",
    end: "2024-06-24T12:00:00",
    description: "Approve transfers before noon cut-off.",
    source: "Beno",
    links: [
      { type: "bill", name: "Payroll batch", amount: "$64,200", due: "Processes at 12:30p" },
      { type: "document", name: "Payroll summary", updated: "Yesterday 9:10p" },
    ],
  },
  {
    id: "evt-4",
    title: "Meds: Synthroid",
    category: "Care",
    start: "2024-06-24T12:30:00",
    end: "2024-06-24T12:40:00",
    source: "Automation",
    canComplete: true,
    links: [{ type: "medication", name: "Synthroid", dose: "75 mcg" }],
  },
  {
    id: "evt-5",
    title: "Operations routine: Monday reset",
    category: "Automations",
    start: "2024-06-24T13:00:00",
    end: "2024-06-24T14:30:00",
    description: "Weekly routine spanning ops checklist.",
    source: "Beno",
    links: [{ type: "routine", name: "Ops reset", cadence: "Weekly on Monday" }],
  },
  {
    id: "evt-6",
    title: "Pick up dry cleaning",
    category: "Household",
    start: "2024-06-24T17:00:00",
    end: "2024-06-24T17:30:00",
    source: "Beno",
    requiresConfirmation: true,
  },
  {
    id: "evt-7",
    title: "Yoga with Maya",
    category: "Wellness",
    start: "2024-06-25T07:30:00",
    end: "2024-06-25T08:15:00",
    source: "Google",
  },
  {
    id: "evt-8",
    title: "Finance: Rent due",
    category: "Finance",
    start: "2024-06-25T09:00:00",
    end: "2024-06-25T09:30:00",
    source: "Automation",
    links: [{ type: "bill", name: "June rent", amount: "$5,200", due: "Fri, 4:00p" }],
  },
  {
    id: "evt-9",
    title: "Smart home maintenance",
    category: "Household",
    start: "2024-06-26T15:00:00",
    end: "2024-06-26T16:30:00",
    source: "Beno",
  },
  {
    id: "evt-10",
    title: "Board dinner",
    category: "Personal",
    start: "2024-06-26T19:00:00",
    end: "2024-06-26T21:00:00",
    location: "Nine at The Conrad",
    source: "Google",
  },
];

const CATEGORY_FILTERS: EventCategory[] = [
  "Personal",
  "Finance",
  "Care",
  "Household",
  "Wellness",
  "Automations",
  "Google",
];

const SOURCE_FILTERS = ["Beno", "Google", "Automation"] as const;

const HOURS_START = 6 * 60;
const HOURS_END = 22 * 60;

const VIEWS: CalendarView[] = ["Day", "Week", "Month"];

function parseMinutesFromIso(iso: string) {
  const date = new Date(iso);
  return date.getHours() * 60 + date.getMinutes();
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTimeRange(start: string, end: string) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${formatter.format(new Date(start))} – ${formatter.format(new Date(end))}`;
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}
export default function CalendarPage() {
  const { toast } = useToast();
  const [view, setView] = useState<CalendarView>("Week");
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isNlpOpen, setIsNlpOpen] = useState(false);
  const [isRoutineDrawerOpen, setIsRoutineDrawerOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<LinkedEntity | null>(null);
  const [activeContextMenu, setActiveContextMenu] = useState<
    | null
    | {
        x: number;
        y: number;
        event: TimelineEvent;
      }
  >(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);
  const [categoryFilters, setCategoryFilters] = useState<Record<EventCategory, boolean>>(() =>
    CATEGORY_FILTERS.reduce(
      (acc, category) => {
        acc[category] = true;
        return acc;
      },
      {} as Record<EventCategory, boolean>
    )
  );
  const [sourceFilters, setSourceFilters] = useState<Record<(typeof SOURCE_FILTERS)[number], boolean>>({
    Beno: true,
    Google: true,
    Automation: true,
  });
  const [nlpText, setNlpText] = useState(
    "Lunch with Alex at Eleven Madison next Tue 1pm for 90m"
  );
  const [isLoadingSync, setIsLoadingSync] = useState(false);

  useEffect(() => {
    const listener = () => setActiveContextMenu(null);
    window.addEventListener("click", listener);
    return () => window.removeEventListener("click", listener);
  }, []);

  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  const referenceDate = useMemo(() => new Date("2024-06-24T10:30:00"), []);

  const timelineDays = useMemo(() => {
    if (view === "Month") {
      const startOfWeek = new Date(referenceDate);
      const day = startOfWeek.getDay();
      const diff = (day + 6) % 7;
      startOfWeek.setDate(startOfWeek.getDate() - diff);
      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        return { date, label: formatDayLabel(date) };
      });
    }

    const count = view === "Day" ? 1 : 5;
    const startOfWeek = new Date(referenceDate);
    const day = startOfWeek.getDay();
    const diff = (day + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - diff);

    return Array.from({ length: count }, (_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return { date, label: formatDayLabel(date) };
    });
  }, [referenceDate, view]);

  const filteredEvents = useMemo(() => {
    return RAW_EVENTS.filter((event) => {
      if (!categoryFilters[event.category]) {
        return false;
      }
      if (!sourceFilters[event.source]) {
        return false;
      }
      if (!isGoogleConnected && event.source === "Google") {
        return false;
      }
      if (view === "Day") {
        return isSameDay(new Date(event.start), referenceDate);
      }
      if (view === "Week") {
        const weekDates = timelineDays.map((d) => d.date);
        return weekDates.some((date) => isSameDay(new Date(event.start), date));
      }
      return true;
    });
  }, [categoryFilters, isGoogleConnected, referenceDate, sourceFilters, timelineDays, view]);

  const upNextItems = useMemo(() => {
    const now = referenceDate.getTime();
    return filteredEvents
      .filter((event) => new Date(event.end).getTime() >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 6);
  }, [filteredEvents, referenceDate]);

  const hours = useMemo(() => {
    const list: number[] = [];
    for (let minute = HOURS_START; minute <= HOURS_END; minute += 60) {
      list.push(minute);
    }
    return list;
  }, []);

  const nowMarker = useMemo(() => {
    const minutes = referenceDate.getHours() * 60 + referenceDate.getMinutes();
    if (minutes < HOURS_START || minutes > HOURS_END) {
      return null;
    }
    const offset = ((minutes - HOURS_START) / (HOURS_END - HOURS_START)) * 100;
    return { offset, date: referenceDate };
  }, [referenceDate]);

  const calendarIsEmpty = view !== "Month" && filteredEvents.length === 0;

  const handleQuickAction = (event: TimelineEvent, action: "snooze" | "done" | "nudge") => {
    const actionLabel =
      action === "snooze" ? "Snoozed 15 minutes" : action === "done" ? "Marked done" : "Nudged";
    toast({
      title: actionLabel,
      description: event.title,
    });
  };

  const handleContextMenu = (evt: TimelineEvent, e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActiveContextMenu({
      x: e.clientX,
      y: e.clientY,
      event: evt,
    });
  };

  const handleOpenEventModal = (event?: TimelineEvent) => {
    if (event) {
      setSelectedEvent(event);
    } else {
      setSelectedEvent(null);
    }
    setIsEventModalOpen(true);
  };

  const manageSyncCalendars = [
    { id: "founder", name: "Founder HQ", color: "bg-cyan-500" },
    { id: "family", name: "Family", color: "bg-emerald-500" },
    { id: "google", name: "Google default", color: "bg-slate-400" },
  ];

  const suggestions = [
    {
      id: "sug-1",
      title: "Block 30m for gym?",
      detail: "You skipped movement twice last week.",
    },
    {
      id: "sug-2",
      title: "Rent due Fri — add pay event?",
      detail: "Keep cash buffer aligned.",
    },
    {
      id: "sug-3",
      title: "Schedule board pre-read?",
      detail: "Board dinner on Wed @ 7p.",
    },
  ];

  const conflicts = [
    {
      id: "conf-1",
      title: "Therapy overlaps payroll buffer",
      detail: "Travel time under 15 minutes.",
    },
    {
      id: "conf-2",
      title: "Rent pay + Ops routine",
      detail: "Two automation holds at 1p.",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Schedule — Calendar"
        description="One canvas for Beno routines, Google events, automations, and care reminders."
        actions={
          <>
            <PagePrimaryAction onClick={() => setIsSyncOpen(true)}>
              Sync Google
            </PagePrimaryAction>
            <PageSecondaryAction onClick={() => setIsNlpOpen(true)}>
              Smart add (NLP)
            </PageSecondaryAction>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl border-slate-700 bg-slate-900/40 text-slate-200"
              onClick={() => setIsRoutineDrawerOpen(true)}
            >
              Create routine
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl border-slate-700 bg-slate-900/40 text-slate-200"
              onClick={() => setIsFiltersOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="relative overflow-hidden rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-2xl">
          <CardHeader className="flex flex-col gap-4 border-b border-slate-800/70 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {VIEWS.map((option) => (
                <Button
                  key={option}
                  size="sm"
                  variant={view === option ? "default" : "secondary"}
                  className={cn(
                    "rounded-2xl px-4",
                    view === option
                      ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                      : "border-slate-700 bg-slate-900/40 text-slate-200"
                  )}
                  onClick={() => setView(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <KeyboardHint label="N" /> new event
              </span>
              <span className="flex items-center gap-1">
                <KeyboardHint label="/" /> smart add
              </span>
              <span className="flex items-center gap-1">
                <KeyboardHint label="T" /> today
              </span>
              <span className="flex items-center gap-1">
                <KeyboardHint label="← →" /> navigate
              </span>
              <span className="flex items-center gap-1">
                <KeyboardHint label="F" /> filters
              </span>
              <span className="flex items-center gap-1">
                <KeyboardHint label="S" /> sync
              </span>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-6 px-0">
            {view === "Month" ? (
              <MonthGrid
                events={filteredEvents}
                onCreate={() => handleOpenEventModal()}
                onOpenEvent={handleOpenEventModal}
              />
            ) : (
              <Timeline
                days={timelineDays}
                events={filteredEvents}
                hours={hours}
                nowMarker={nowMarker}
                view={view}
                calendarIsEmpty={calendarIsEmpty}
                isGoogleConnected={isGoogleConnected}
                onCreate={() => handleOpenEventModal()}
                onHoverChange={setHoveredEventId}
                hoveredEventId={hoveredEventId}
                onQuickAction={handleQuickAction}
                onOpenEvent={handleOpenEventModal}
                onContextMenu={handleContextMenu}
                onLinkOpen={setActiveLink}
                onConnect={() => setIsSyncOpen(true)}
                onSmartAdd={() => setIsNlpOpen(true)}
                onRescheduled={(title) =>
                  toast({ title: "Rescheduled", description: title })
                }
              />
            )}
          </CardContent>
          <div className="flex flex-col gap-4 border-t border-slate-800/70 px-6 py-5 text-sm text-slate-300 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                className="h-9 rounded-2xl bg-rose-500/90 px-4 text-white shadow-lg shadow-rose-900/40 hover:bg-rose-500"
                onClick={() => {
                  toast({ title: "Jumped to now" });
                }}
              >
                <Clock className="mr-2 h-4 w-4" /> Now
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-2xl border-slate-700 bg-slate-900/40 px-4 text-slate-200"
                onClick={() => setView("Day")}
              >
                Today
              </Button>
              <span className="flex items-center gap-2 text-xs text-slate-400">
                <AlarmClock className="h-4 w-4" />
                {timezone}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {CATEGORY_FILTERS.map((category) => (
                <span key={category} className="flex items-center gap-1 text-xs text-slate-400">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      CATEGORY_STYLES[category].legend
                    )}
                  />
                  {category}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <aside className="flex flex-col gap-4">
          <RightRailCard
            title="Up next"
            icon={<CalendarDays className="h-4 w-4 text-emerald-300" />}
            description="Next six items across routines, meds, and Google."
          >
            {upNextItems.length === 0 ? (
              <p className="text-sm text-slate-400">
                Nothing upcoming — clear filters or add via Smart add.
              </p>
            ) : (
              <ul className="space-y-3">
                {upNextItems.map((event) => (
                  <li
                    key={event.id}
                    className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs text-slate-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-slate-100">{event.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {formatTimeRange(event.start, event.end)} · {event.source}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-xl border-none px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          CATEGORY_STYLES[event.category].chip
                        )}
                      >
                        {event.category}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-xl border-slate-700 px-3 text-[11px]"
                        onClick={() => handleOpenEventModal(event)}
                      >
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-xl border-slate-700 px-3 text-[11px]"
                        onClick={() => handleQuickAction(event, "snooze")}
                      >
                        Snooze 15m
                      </Button>
                      {event.canComplete ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-xl border-slate-700 px-3 text-[11px]"
                          onClick={() => handleQuickAction(event, "done")}
                        >
                          Done
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-xl border-slate-700 px-3 text-[11px]"
                        onClick={() => handleQuickAction(event, "nudge")}
                      >
                        Nudge
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </RightRailCard>

          <RightRailCard
            title="Beno suggestions"
            icon={<Sparkles className="h-4 w-4 text-sky-300" />}
            description="AI nudges tuned to current routines and obligations."
          >
            <ul className="space-y-3">
              {suggestions.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs text-slate-300"
                >
                  <p className="font-medium text-slate-100">{item.title}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{item.detail}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="h-8 rounded-xl bg-emerald-500 px-3 text-[11px] text-white hover:bg-emerald-500/90"
                      onClick={() => toast({ title: "Suggestion accepted", description: item.title })}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-xl border-slate-700 px-3 text-[11px]"
                      onClick={() => toast({ title: "Simulate", description: `${item.title} → impacts forecast` })}
                    >
                      Simulate
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 rounded-xl px-3 text-[11px] text-slate-400"
                      onClick={() => toast({ title: "Suggestion dismissed", description: item.title })}
                    >
                      Dismiss
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </RightRailCard>

          <RightRailCard
            title="Conflicts"
            icon={<Bell className="h-4 w-4 text-rose-300" />}
            description="Overlaps or travel buffers under 15 minutes."
          >
            <ul className="space-y-3">
              {conflicts.map((conflict) => (
                <li
                  key={conflict.id}
                  className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-100"
                >
                  <p className="font-semibold">{conflict.title}</p>
                  <p className="mt-1 text-[11px] text-rose-200/80">{conflict.detail}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      className="h-8 rounded-xl bg-rose-500 px-3 text-[11px] text-white hover:bg-rose-500/90"
                      onClick={() => toast({ title: "Auto-resolve running", description: conflict.title })}
                    >
                      Auto-resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 rounded-xl px-3 text-[11px] text-rose-100/80 hover:text-rose-50"
                      onClick={() => toast({ title: "Conflict details", description: conflict.detail })}
                    >
                      Review
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </RightRailCard>
        </aside>
      </div>
      <Button
        size="lg"
        className="fixed bottom-10 right-10 z-40 rounded-3xl bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 px-6 text-white shadow-2xl shadow-emerald-900/40 hover:shadow-emerald-900/60"
        onClick={() => handleOpenEventModal()}
      >
        <Plus className="mr-2 h-5 w-5" /> New event
      </Button>

      <ManageSyncDialog
        open={isSyncOpen}
        onOpenChange={setIsSyncOpen}
        calendars={manageSyncCalendars}
        isGoogleConnected={isGoogleConnected}
        onConnectionChange={setIsGoogleConnected}
        isLoading={isLoadingSync}
        onRefresh={() => {
          setIsLoadingSync(true);
          setTimeout(() => {
            setIsLoadingSync(false);
            setIsSyncOpen(false);
            toast({ title: "Calendar refreshed" });
          }, 800);
        }}
      />

      <NlpDialog
        open={isNlpOpen}
        onOpenChange={setIsNlpOpen}
        text={nlpText}
        onTextChange={setNlpText}
        onConfirm={() => {
          toast({ title: "Event created", description: "Gym blocked for 30 minutes" });
          setIsNlpOpen(false);
        }}
        onEdit={() => {
          handleOpenEventModal();
          setIsNlpOpen(false);
        }}
      />

      <RoutineBuilderSheet
        open={isRoutineDrawerOpen}
        onOpenChange={setIsRoutineDrawerOpen}
        onSave={() => {
          toast({ title: "Routine scheduled", description: "Ops reset now recurring." });
        }}
      />

      <FiltersSheet
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        categoryFilters={categoryFilters}
        onCategoryToggle={(category) =>
          setCategoryFilters((prev) => ({
            ...prev,
            [category]: !prev[category],
          }))
        }
        sourceFilters={sourceFilters}
        onSourceToggle={(source) =>
          setSourceFilters((prev) => ({
            ...prev,
            [source]: !prev[source],
          }))
        }
        onSavePreset={() => toast({ title: "Preset saved", description: "Finance + Care" })}
      />

      <EventModal
        open={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        event={selectedEvent}
        onSave={(mode) => {
          toast({ title: mode === "nudge" ? "Saved & nudged" : "Event saved" });
          setIsEventModalOpen(false);
        }}
        onDelete={() => {
          toast({ title: "Event deleted" });
          setIsEventModalOpen(false);
        }}
        onShare={(channel) => toast({ title: `Shared via ${channel}` })}
      />

      <LinkedEntityDrawers
        entity={activeLink}
        onClose={() => setActiveLink(null)}
        onOpenDestination={(destination) =>
          toast({
            title: `Opening ${destination}`,
            description: "Navigation would occur in-app.",
          })
        }
      />

      {activeContextMenu ? (
        <ContextMenuCard
          x={activeContextMenu.x}
          y={activeContextMenu.y}
          event={activeContextMenu.event}
          onOpen={handleOpenEventModal}
          onClose={() => setActiveContextMenu(null)}
          onQuickAction={handleQuickAction}
        />
      ) : null}
    </div>
  );
}

function KeyboardHint({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-slate-700 bg-slate-900/60 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-200">
      {label}
    </span>
  );
}

function RightRailCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-2xl">
      <CardHeader className="space-y-2 border-b border-slate-800/70 px-5 py-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-900/70">
            {icon}
          </span>
          {title}
        </div>
        <p className="text-xs text-slate-400">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-5">
        {children}
      </CardContent>
    </Card>
  );
}
function Timeline({
  days,
  events,
  hours,
  nowMarker,
  view,
  calendarIsEmpty,
  isGoogleConnected,
  onCreate,
  onHoverChange,
  hoveredEventId,
  onQuickAction,
  onOpenEvent,
  onContextMenu,
  onLinkOpen,
  onConnect,
  onSmartAdd,
  onRescheduled,
}: {
  days: { date: Date; label: string }[];
  events: TimelineEvent[];
  hours: number[];
  nowMarker: { offset: number; date: Date } | null;
  view: CalendarView;
  calendarIsEmpty: boolean;
  isGoogleConnected: boolean;
  onCreate: () => void;
  onHoverChange: (eventId: string | null) => void;
  hoveredEventId: string | null;
  onQuickAction: (event: TimelineEvent, action: "snooze" | "done" | "nudge") => void;
  onOpenEvent: (event: TimelineEvent) => void;
  onContextMenu: (event: TimelineEvent, e: MouseEvent<HTMLDivElement>) => void;
  onLinkOpen: (link: LinkedEntity) => void;
  onConnect: () => void;
  onSmartAdd: () => void;
  onRescheduled: (title: string) => void;
}) {
  const totalMinutes = HOURS_END - HOURS_START;
  const columns = days.map(({ date }) =>
    events.filter((event) => isSameDay(new Date(event.start), date))
  );

  const gridStyle: CSSProperties = {
    gridTemplateColumns: `72px repeat(${days.length}, minmax(0, 1fr))`,
  };

  return (
    <div className="relative">
      <div className="grid h-[720px]" style={gridStyle}>
        <div className="relative border-r border-slate-800/70 bg-slate-950/70">
          {hours.map((minute) => {
            const hour = Math.floor(minute / 60);
            const label = `${(hour % 12) || 12}${hour >= 12 ? "p" : "a"}`;
            return (
              <div
                key={minute}
                className="h-[calc(100%/16)] border-b border-slate-900/40 px-3 text-[10px] uppercase tracking-wide text-slate-500"
              >
                <div className="sticky top-3 translate-y-[-50%]">{label}</div>
              </div>
            );
          })}
        </div>

        {days.map((day, index) => (
          <div
            key={day.label}
            className="relative border-l border-slate-800/70 bg-gradient-to-b from-slate-950/60 via-slate-950/30 to-slate-950/60"
            onDoubleClick={onCreate}
          >
            <div className="flex items-center justify-between border-b border-slate-800/70 bg-slate-950/80 px-4 py-3 text-xs text-slate-400">
              <span className="font-medium text-slate-100">{day.label}</span>
              <span>{new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(day.date)}</span>
            </div>
            <div className="absolute inset-0">
              {hours.map((minute) => (
                <div
                  key={`${day.label}-${minute}`}
                  className="h-[calc(100%/16)] border-b border-dashed border-slate-900/40"
                />
              ))}
            </div>

            {nowMarker && isSameDay(nowMarker.date, day.date) ? (
              <div
                className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
                style={{ top: `${nowMarker.offset}%` }}
              >
                <span className="h-[1px] flex-1 bg-rose-500/80" />
                <span className="ml-2 flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] text-rose-100">
                  Now
                </span>
              </div>
            ) : null}

            <div className="relative h-full px-3 py-4">
              {columns[index].map((event) => {
                const startMinutes = parseMinutesFromIso(event.start);
                const endMinutes = parseMinutesFromIso(event.end);
                const top = ((startMinutes - HOURS_START) / totalMinutes) * 100;
                const height = Math.max(((endMinutes - startMinutes) / totalMinutes) * 100, 6);

                return (
                  <div
                    key={event.id}
                    className="absolute left-3 right-3"
                    style={{ top: `${top}%`, height: `${height}%` }}
                  >
                    <div
                      className={cn(
                        "group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl border px-3 py-2 text-left shadow-lg transition",
                        CATEGORY_STYLES[event.category].chip,
                        hoveredEventId === event.id && "ring-2 ring-white/40"
                      )}
                      onMouseEnter={() => onHoverChange(event.id)}
                      onMouseLeave={() => onHoverChange(null)}
                      onFocus={() => onHoverChange(event.id)}
                      onBlur={() => onHoverChange(null)}
                      onContextMenu={(e) => onContextMenu(event, e)}
                      draggable
                      onDragEnd={() => onRescheduled(event.title)}
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wide">
                        <span>{formatTimeRange(event.start, event.end)}</span>
                        <span className="flex items-center gap-1">
                          <span className={cn("h-1.5 w-1.5 rounded-full", CATEGORY_STYLES[event.category].dot)} />
                          {event.source}
                        </span>
                      </div>
                      <div>
                        <button
                          className="text-left text-sm font-semibold leading-tight text-white"
                          onClick={() => onOpenEvent(event)}
                        >
                          {event.title}
                        </button>
                        {event.location ? (
                          <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-100/80">
                            <MapPin className="h-3 w-3" /> {event.location}
                          </p>
                        ) : null}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 rounded-xl bg-black/30 px-3 text-[10px] text-white backdrop-blur"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickAction(event, "snooze");
                          }}
                        >
                          Snooze
                        </Button>
                        {event.canComplete ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 rounded-xl bg-black/30 px-3 text-[10px] text-white backdrop-blur"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAction(event, "done");
                            }}
                          >
                            Done
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 rounded-xl bg-black/30 px-3 text-[10px] text-white backdrop-blur"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickAction(event, "nudge");
                          }}
                        >
                          Nudge
                        </Button>
                      </div>
                    </div>
                    {hoveredEventId === event.id ? (
                      <div className="mt-2 w-full rounded-2xl border border-slate-800/70 bg-slate-950/90 p-3 text-xs text-slate-200 shadow-xl">
                        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                          <span>{formatTimeRange(event.start, event.end)}</span>
                          {event.location ? (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {event.location}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm font-semibold text-white">{event.title}</p>
                        {event.description ? (
                          <p className="mt-1 text-[11px] text-slate-400">{event.description}</p>
                        ) : null}
                        {event.links && event.links.length > 0 ? (
                          <div className="mt-2 space-y-2">
                            {event.links.map((link, indexLink) => (
                              <button
                                key={`${event.id}-${link.type}-${indexLink}`}
                                className="flex w-full items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/50 px-3 py-2 text-left text-[11px] text-slate-200 transition hover:border-slate-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onLinkOpen(link);
                                }}
                              >
                                <span className="flex items-center gap-2">
                                  <LinkIcon className="h-3 w-3" />
                                  {link.type === "bill" ? (
                                    <span>
                                      {link.name} · {link.amount}
                                    </span>
                                  ) : link.type === "document" ? (
                                    <span>{link.name}</span>
                                  ) : link.type === "medication" ? (
                                    <span>{link.name}</span>
                                  ) : (
                                    <span>{link.name}</span>
                                  )}
                                </span>
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            ))}
                          </div>
                        ) : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-xl border-slate-700 px-3 text-[11px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAction(event, "snooze");
                            }}
                          >
                            Snooze 15m
                          </Button>
                          {event.canComplete ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 rounded-xl border-slate-700 px-3 text-[11px]"
                              onClick={(e) => {
                                e.stopPropagation();
                                onQuickAction(event, "done");
                              }}
                            >
                              Done
                            </Button>
                          ) : null}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-xl border-slate-700 px-3 text-[11px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAction(event, "nudge");
                            }}
                          >
                            Nudge
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {calendarIsEmpty ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-10 text-center text-sm text-slate-400">
                    {isGoogleConnected ? (
                      <>
                        <p className="font-semibold text-slate-100">Nothing scheduled for this view.</p>
                        <p className="mt-2 text-xs text-slate-500">
                          Clear filters or try Smart add to draft something fast.
                        </p>
                        <div className="mt-4 flex justify-center gap-3">
                          <Button size="sm" className="h-9 rounded-2xl bg-indigo-500 px-4 text-white" onClick={onCreate}>
                            <Plus className="mr-2 h-4 w-4" /> Quick event
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-2xl border-slate-700 px-4 text-slate-200"
                            onClick={onSmartAdd}
                          >
                            Smart add
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-slate-100">No calendar connected</p>
                        <p className="mt-2 text-xs text-slate-500">
                          Connect Google or use Smart add to start scheduling.
                        </p>
                        <div className="mt-4 flex justify-center gap-3">
                          <Button size="sm" className="h-9 rounded-2xl bg-emerald-500 px-4 text-white" onClick={onConnect}>
                            Connect Google
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-2xl border-slate-700 px-4 text-slate-200"
                            onClick={onSmartAdd}
                          >
                            Smart add
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function MonthGrid({
  events,
  onCreate,
  onOpenEvent,
}: {
  events: TimelineEvent[];
  onCreate: () => void;
  onOpenEvent: (event: TimelineEvent) => void;
}) {
  const grouped = events.reduce<Record<string, TimelineEvent[]>>((acc, event) => {
    const key = new Date(event.start).toISOString().split("T")[0];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {});

  const weeks = 4;
  const days = 7;

  return (
    <div className="p-6">
      <div className="grid grid-cols-7 gap-2 text-xs uppercase tracking-wide text-slate-500">
        {Array.from({ length: days }).map((_, index) => (
          <div key={index} className="text-center">
            {new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(
              new Date(Date.UTC(2024, 5, 24 + index))
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {Array.from({ length: weeks * days }).map((_, index) => {
          const date = new Date(Date.UTC(2024, 5, 24 + index));
          const key = date.toISOString().split("T")[0];
          const dayEvents = grouped[key] ?? [];
          return (
            <div
              key={key}
              className="flex min-h-[120px] flex-col rounded-2xl border border-slate-800/70 bg-slate-950/60 p-3 text-xs text-slate-400 transition hover:border-slate-700"
              onDoubleClick={onCreate}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{date.getUTCDate()}</span>
                <button
                  className="rounded-lg border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-300"
                  onClick={onCreate}
                >
                  Add
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onOpenEvent(event)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-2 py-1 text-left text-[11px]",
                      CATEGORY_STYLES[event.category].chip
                    )}
                  >
                    <span className="truncate text-white">{event.title}</span>
                    <span className="ml-2 shrink-0 text-[10px] text-white/70">
                      {new Intl.DateTimeFormat(undefined, { hour: "numeric" }).format(
                        new Date(event.start)
                      )}
                    </span>
                  </button>
                ))}
                {dayEvents.length > 3 ? (
                  <button className="text-[10px] text-indigo-300" onClick={() => onOpenEvent(dayEvents[0])}>
                    +{dayEvents.length - 3} more
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function ManageSyncDialog({
  open,
  onOpenChange,
  calendars,
  isGoogleConnected,
  onConnectionChange,
  isLoading,
  onRefresh,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendars: { id: string; name: string; color: string }[];
  isGoogleConnected: boolean;
  onConnectionChange: (value: boolean) => void;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <CalendarCheck className="h-5 w-5 text-emerald-400" /> Manage sync
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400">
            Connect Google then choose which calendars Beno should mirror.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-100">Google account</p>
              <p className="text-xs text-slate-400">
                {isGoogleConnected ? "Connected as ceo@founder.hq" : "Not connected"}
              </p>
            </div>
            <Button
              size="sm"
              className="h-9 rounded-2xl bg-indigo-500 px-4 text-white"
              onClick={() => onConnectionChange(!isGoogleConnected)}
            >
              {isGoogleConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Calendars</span>
              <Button size="sm" variant="ghost" className="h-8 rounded-xl px-3 text-[11px] text-slate-400">
                Select all
              </Button>
            </div>
            <div className="grid gap-3">
              {calendars.map((calendar) => (
                <label
                  key={calendar.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("h-3 w-3 rounded-full", calendar.color)} />
                    {calendar.name}
                  </span>
                  <Switch defaultChecked={calendar.id !== "family"} />
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
            <div>
              <Label className="text-xs uppercase tracking-wide text-slate-400">Default reminder</Label>
              <div className="mt-2 flex items-center gap-3 text-sm text-slate-200">
                <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                  15 minutes before
                </Button>
                <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                  + Add
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wide text-slate-400">Conflict rule</Label>
              <p className="mt-2 text-sm text-slate-300">
                Hold at least <strong>15 minutes</strong> between off-site events.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-slate-500">
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Refresh pulls latest Google events immediately.
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="h-9 rounded-2xl px-4 text-slate-300"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-9 rounded-2xl bg-emerald-500 px-4 text-white"
              onClick={onRefresh}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save & refresh"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function NlpDialog({
  open,
  onOpenChange,
  text,
  onTextChange,
  onConfirm,
  onEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  text: string;
  onTextChange: (value: string) => void;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-3xl border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <Sparkles className="h-5 w-5 text-sky-300" /> Smart add
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400">
            Type in plain English. Beno parses time, duration, links, and reminders.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-wide text-slate-400">What do you want to schedule?</Label>
            <Textarea
              value={text}
              onChange={(event) => onTextChange(event.target.value)}
              className="mt-2 min-h-[100px] rounded-2xl border-slate-800 bg-slate-900/60 text-sm text-slate-200"
              placeholder="Ex: Block 30m for gym tomorrow at 7am"
            />
          </div>
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-400">Preview</p>
            <div className="mt-2 space-y-1">
              <p className="font-semibold text-white">Gym session</p>
              <p className="text-xs text-slate-400">Tue · 7:00 – 7:30 AM · Automations</p>
              <p className="text-xs text-slate-400">Reminder: 15 minutes before · Location: Home gym</p>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            className="h-9 rounded-2xl px-4 text-slate-300"
            onClick={onEdit}
          >
            Edit in modal
          </Button>
          <Button
            className="h-9 rounded-2xl bg-emerald-500 px-4 text-white"
            onClick={onConfirm}
          >
            Confirm event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function RoutineBuilderSheet({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-l border-slate-800 bg-slate-950/95 text-slate-100 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl text-white">
            <CalendarPlus className="h-5 w-5 text-indigo-300" /> Routine builder
          </SheetTitle>
          <SheetDescription className="text-sm text-slate-400">
            Define cadence, steps, and automation nudges without leaving the calendar.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Routine name</Label>
            <Input className="rounded-2xl border-slate-800 bg-slate-900/60 text-slate-200" defaultValue="Ops reset" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Cadence</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "Every weekday",
                "Mon / Wed / Fri",
                "Weekly",
                "Custom RRULE",
              ].map((option) => (
                <Button key={option} size="sm" variant="outline" className="h-9 rounded-2xl border-slate-700 px-4 text-[11px]">
                  {option}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Steps</Label>
            <div className="space-y-2 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-200">
              <div className="flex items-center justify-between">
                <span>Audit automation queue</span>
                <Button size="sm" variant="ghost" className="h-8 rounded-xl px-3 text-[11px] text-slate-400">
                  Edit
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Send summary to Emma</span>
                <Button size="sm" variant="ghost" className="h-8 rounded-xl px-3 text-[11px] text-slate-400">
                  Edit
                </Button>
              </div>
              <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                + Add step
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Automations</Label>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-200">
              <p className="text-xs text-slate-400">Attach pre or post reminders:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                  Slack digest
                </Button>
                <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                  Email recap
                </Button>
                <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                  Add meds
                </Button>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            className="h-9 rounded-2xl px-4 text-slate-300"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className="h-9 rounded-2xl bg-emerald-500 px-4 text-white"
            onClick={() => {
              onSave();
              onOpenChange(false);
            }}
          >
            Save routine
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
function FiltersSheet({
  open,
  onOpenChange,
  categoryFilters,
  onCategoryToggle,
  sourceFilters,
  onSourceToggle,
  onSavePreset,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryFilters: Record<EventCategory, boolean>;
  onCategoryToggle: (category: EventCategory) => void;
  sourceFilters: Record<(typeof SOURCE_FILTERS)[number], boolean>;
  onSourceToggle: (source: (typeof SOURCE_FILTERS)[number]) => void;
  onSavePreset: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-l border-slate-800 bg-slate-950/95 text-slate-100 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl text-white">
            <Filter className="h-5 w-5 text-emerald-300" /> Filters
          </SheetTitle>
          <SheetDescription className="text-sm text-slate-400">
            Toggle by category or source. Save presets for quick switching.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Categories</Label>
            <ScrollArea className="h-48 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
              <div className="space-y-3">
                {CATEGORY_FILTERS.map((category) => (
                  <label key={category} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          CATEGORY_STYLES[category].legend
                        )}
                      />
                      {category}
                    </span>
                    <Switch checked={categoryFilters[category]} onCheckedChange={() => onCategoryToggle(category)} />
                  </label>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Sources</Label>
            <div className="space-y-2 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
              {SOURCE_FILTERS.map((source) => (
                <label key={source} className="flex items-center justify-between text-sm text-slate-200">
                  <span>{source}</span>
                  <Switch checked={sourceFilters[source]} onCheckedChange={() => onSourceToggle(source)} />
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Presets</Label>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                Clear
              </Button>
              <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                Essentials
              </Button>
              <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                Family
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            className="h-9 rounded-2xl px-4 text-slate-300"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className="h-9 rounded-2xl bg-emerald-500 px-4 text-white"
            onClick={() => {
              onSavePreset();
              onOpenChange(false);
            }}
          >
            Save preset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
function EventModal({
  open,
  onOpenChange,
  event,
  onSave,
  onDelete,
  onShare,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: TimelineEvent | null;
  onSave: (mode: "default" | "nudge") => void;
  onDelete: () => void;
  onShare: (channel: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-3xl border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <CalendarDays className="h-5 w-5 text-indigo-300" /> {event ? "Edit event" : "New event"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400">
            Title, links, reminders, and nudges all live here. No navigation required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-400">Title</Label>
              <Input
                className="rounded-2xl border-slate-800 bg-slate-900/60 text-slate-200"
                defaultValue={event?.title ?? ""}
                placeholder="What are we scheduling?"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-400">Start</Label>
                <Input
                  type="datetime-local"
                  className="rounded-2xl border-slate-800 bg-slate-900/60 text-slate-200"
                  defaultValue={event?.start.slice(0, 16)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-400">End</Label>
                <Input
                  type="datetime-local"
                  className="rounded-2xl border-slate-800 bg-slate-900/60 text-slate-200"
                  defaultValue={event?.end.slice(0, 16)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-400">Location</Label>
              <Input
                className="rounded-2xl border-slate-800 bg-slate-900/60 text-slate-200"
                defaultValue={event?.location ?? ""}
                placeholder="Optional location"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-400">Description</Label>
              <Textarea
                className="min-h-[120px] rounded-2xl border-slate-800 bg-slate-900/60 text-sm text-slate-200"
                defaultValue={event?.description ?? "Agenda, links, prep notes..."}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-400">Recurrence</Label>
                <Button size="sm" variant="outline" className="h-9 w-full rounded-2xl border-slate-700 px-4 text-[11px]">
                  {event?.category === "Automations" ? "Weekly" : "None"}
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-slate-400">Reminders</Label>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                    15m before
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                    Day prior
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 rounded-xl border-slate-700 px-3 text-[11px]">
                    + Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-400">Type</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_FILTERS.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant="outline"
                    className={cn(
                      "h-8 rounded-xl border-slate-700 px-3 text-[11px]",
                      event?.category === category && "border-white/70 bg-white/10 text-white"
                    )}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-slate-400">Links</Label>
              <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-200">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Attach document
                  </span>
                  <Button size="sm" variant="ghost" className="h-8 rounded-xl px-3 text-[11px] text-slate-400">
                    Vault
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Repeat className="h-4 w-4" /> Link bill or automation
                  </span>
                  <Button size="sm" variant="ghost" className="h-8 rounded-xl px-3 text-[11px] text-slate-400">
                    Finance
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Pill className="h-4 w-4" /> Medication or care
                  </span>
                  <Button size="sm" variant="ghost" className="h-8 rounded-xl px-3 text-[11px] text-slate-400">
                    Care
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-slate-400">Share</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "WhatsApp", channel: "WhatsApp" },
                  { label: "PDF", channel: "PDF" },
                  { label: "ICS", channel: "ICS" },
                ].map((item) => (
                  <Button
                    key={item.label}
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-xl border-slate-700 px-3 text-[11px]"
                    onClick={() => onShare(item.channel)}
                  >
                    <Share2 className="mr-2 h-3.5 w-3.5" /> {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="h-9 rounded-2xl px-4 text-rose-300"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
            <Button
              className="h-9 rounded-2xl bg-indigo-500 px-4 text-white"
              onClick={() => onSave("default")}
            >
              Save
            </Button>
            <Button
              className="h-9 rounded-2xl bg-emerald-500 px-4 text-white"
              onClick={() => onSave("nudge")}
            >
              Save & nudge
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function LinkedEntityDrawers({
  entity,
  onClose,
  onOpenDestination,
}: {
  entity: LinkedEntity | null;
  onClose: () => void;
  onOpenDestination: (destination: string) => void;
}) {
  return (
    <>
      <Sheet open={entity?.type === "bill"} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full border-l border-slate-800 bg-slate-950/95 text-slate-100 sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg text-white">
              <CalendarDays className="h-5 w-5 text-cyan-300" /> Bill details
            </SheetTitle>
            <SheetDescription className="text-sm text-slate-400">
              Stay on this page—mark it paid or jump to Finance when ready.
            </SheetDescription>
          </SheetHeader>
          {entity?.type === "bill" ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-400">Bill</p>
                <p className="mt-1 text-lg font-semibold text-white">{entity.name}</p>
                <p className="text-sm text-slate-300">Amount · {entity.amount}</p>
                <p className="mt-2 text-xs text-slate-400">Due {entity.due}</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-200">
                <span>Mark paid</span>
                <Switch defaultChecked />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-9 flex-1 rounded-2xl bg-emerald-500 px-4 text-white"
                  onClick={() => onOpenDestination("Finance overview")}
                >
                  Open in Finance
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 flex-1 rounded-2xl border-slate-700 px-4 text-[11px] text-slate-200"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <Dialog open={entity?.type === "document"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl rounded-3xl border border-slate-800 bg-slate-950/95 text-slate-100">
          {entity?.type === "document" ? (
            <div className="space-y-4">
              <DialogHeader className="space-y-1">
                <DialogTitle className="flex items-center gap-2 text-xl text-white">
                  <FileText className="h-5 w-5 text-indigo-300" /> {entity.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-400">
                  Vault preview stays modal. Jump to Vault only if you need full context.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-400">Last updated</p>
                <p className="mt-1 text-sm text-slate-200">{entity.updated}</p>
                <div className="mt-4 h-48 rounded-xl border border-dashed border-slate-800/70 bg-slate-950/60 text-center text-xs text-slate-500">
                  Document preview placeholder
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-9 flex-1 rounded-2xl bg-indigo-500 px-4 text-white"
                  onClick={() => onOpenDestination("Vault")}
                >
                  Open in Vault
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 flex-1 rounded-2xl border-slate-700 px-4 text-[11px] text-slate-200"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Sheet open={entity?.type === "medication"} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full border-l border-slate-800 bg-slate-950/95 text-slate-100 sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg text-white">
              <Pill className="h-5 w-5 text-emerald-300" /> Medication
            </SheetTitle>
            <SheetDescription className="text-sm text-slate-400">
              Quick card stays here. Deeper details live in Care.
            </SheetDescription>
          </SheetHeader>
          {entity?.type === "medication" ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-400">Medication</p>
                <p className="mt-1 text-lg font-semibold text-white">{entity.name}</p>
                <p className="text-sm text-slate-300">Dose · {entity.dose}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-9 flex-1 rounded-2xl bg-emerald-500 px-4 text-white"
                  onClick={() => onOpenDestination("Care")}
                >
                  Open in Care
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 flex-1 rounded-2xl border-slate-700 px-4 text-[11px] text-slate-200"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <Sheet open={entity?.type === "routine"} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full border-l border-slate-800 bg-slate-950/95 text-slate-100 sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg text-white">
              <Repeat className="h-5 w-5 text-rose-300" /> Routine summary
            </SheetTitle>
            <SheetDescription className="text-sm text-slate-400">
              Keep the routine drawer here. Navigate only if you need edits.
            </SheetDescription>
          </SheetHeader>
          {entity?.type === "routine" ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-400">Routine</p>
                <p className="mt-1 text-lg font-semibold text-white">{entity.name}</p>
                <p className="text-sm text-slate-300">Cadence · {entity.cadence}</p>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-400">Next steps</p>
                <ul className="list-disc space-y-1 pl-5 text-xs text-slate-300">
                  <li>Review automation queue</li>
                  <li>Send digest to team</li>
                  <li>Mark blockers</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-9 flex-1 rounded-2xl bg-indigo-500 px-4 text-white"
                  onClick={() => onOpenDestination("Schedule routines")}
                >
                  Open routines
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 flex-1 rounded-2xl border-slate-700 px-4 text-[11px] text-slate-200"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
function ContextMenuCard({
  x,
  y,
  event,
  onOpen,
  onClose,
  onQuickAction,
}: {
  x: number;
  y: number;
  event: TimelineEvent;
  onOpen: (event: TimelineEvent) => void;
  onClose: () => void;
  onQuickAction: (event: TimelineEvent, action: "snooze" | "done" | "nudge") => void;
}) {
  return (
    <div
      className="fixed z-50"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      <Card className="w-56 rounded-2xl border border-slate-800/80 bg-slate-950/95 p-2 text-sm text-slate-200 shadow-xl">
        <p className="px-2 pb-2 text-xs uppercase tracking-wide text-slate-500">{event.title}</p>
        <div className="grid gap-1">
          <button
            className="flex items-center justify-between rounded-xl px-2 py-2 text-left transition hover:bg-slate-900/60"
            onClick={() => {
              onOpen(event);
              onClose();
            }}
          >
            <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Edit</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            className="flex items-center justify-between rounded-xl px-2 py-2 text-left transition hover:bg-slate-900/60"
            onClick={() => {
              onQuickAction(event, "nudge");
              onClose();
            }}
          >
            <span className="flex items-center gap-2"><BellRing className="h-4 w-4" /> Nudge</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            className="flex items-center justify-between rounded-xl px-2 py-2 text-left transition hover:bg-slate-900/60"
            onClick={() => {
              onQuickAction(event, "snooze");
              onClose();
            }}
          >
            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Snooze 15m</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          <button className="flex items-center justify-between rounded-xl px-2 py-2 text-left transition hover:bg-slate-900/60">
            <span className="flex items-center gap-2"><Copy className="h-4 w-4" /> Duplicate</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          <button className="flex items-center justify-between rounded-xl px-2 py-2 text-left transition hover:bg-slate-900/60">
            <span className="flex items-center gap-2"><Share2 className="h-4 w-4" /> Convert to task</span>
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            className="flex items-center justify-between rounded-xl px-2 py-2 text-left text-rose-200 transition hover:bg-rose-500/10"
            onClick={() => {
              onClose();
            }}
          >
            <span className="flex items-center gap-2"><Trash2 className="h-4 w-4" /> Delete</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </Card>
    </div>
  );
}
