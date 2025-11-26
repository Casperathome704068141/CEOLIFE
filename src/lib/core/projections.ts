import { addMinutes, formatISO, subMinutes } from "date-fns";
import {
  CanvasContext,
  ImpactPlan,
  Overview,
  QueueItem,
  ScenarioPreview,
  TimelineEntry,
  BillDoc,
  GoalDoc,
  TransactionDoc,
} from "../schemas";
import { EventRecord } from "./eventLog";
import { broadcastProjectionUpdate } from "./sse";

// These would be hydrated from a Firestore query in a real app
const allBills: BillDoc[] = []; 
const allGoals: GoalDoc[] = [];
const allTransactions: TransactionDoc[] = [];

const overviewState: Overview = {
  netWorth: 185000,
  cashOnHand: { amount: 42000, runwayDays: 128 },
  nextBills: { count: 5, total: 3200, soonest: new Date().toISOString() },
  monthlyBurn: { actual: 6400, target: 6000 },
  savingsProgress: { percent: 58, delta: 3 },
  adherence: { percent30d: 92, onHandDays: 16 },
  goals: {
    top: [
      { id: "goal-emergency", name: "Emergency fund", percent: 72, eta: "2025-04-30" },
      { id: "goal-rental", name: "Rental upgrade", percent: 34, eta: "2025-12-01" },
      { id: "goal-pulse", name: "Pulse bankroll", percent: 55 },
    ],
  },
  pulse: { games: 3, bestValueScore: 7.6 },
};

let queueState: QueueItem[] = [
  {
    id: "bill-electric",
    kind: "bill",
    category: "finance",
    title: "Electric Co. payment due",
    detail: "Due in 2 days · autopay off",
    priorityScore: 86,
    impact: { runwayDelta: -3 },
    actions: ["Accept", "Schedule", "Nudge", "Explain", "Open"],
    links: [
      { entityId: "bill-electric", entityType: "bill" },
      { entityId: "doc-electric-statement", entityType: "document" },
    ],
  },
  {
    id: "goal-emergency",
    kind: "goalUnderfunded",
    category: "goals",
    title: "Emergency fund behind pace",
    detail: "Allocate $300 to recover 2 weeks",
    priorityScore: 74,
    impact: { goalEtaDeltaDays: -14 },
    actions: ["Accept", "Simulate", "Explain"],
    links: [{ entityId: "goal-emergency", entityType: "goal" }],
  },
  {
    id: "dose-levothyroxine",
    kind: "doseOverdue",
    category: "care",
    title: "Levothyroxine dose overdue",
    detail: "Missed 30m · safety bypass active",
    priorityScore: 92,
    impact: { adherenceDelta: 2 },
    actions: ["Accept", "Nudge", "Explain"],
    links: [
      { entityId: "med-levothyroxine", entityType: "medication" },
      { entityId: "dose-levothyroxine", entityType: "dose" },
    ],
  },
  {
    id: "weather-storm",
    kind: "weatherAlert",
    category: "home",
    title: "Severe weather incoming",
    detail: "Wind advisory overlaps soccer practice",
    priorityScore: 65,
    actions: ["Schedule", "Explain", "Open"],
    links: [{ entityId: "event-soccer", entityType: "event" }],
  },
  {
    id: "pulse-value",
    kind: "valuePlay",
    category: "pulse",
    title: "Lakers -3.5 model edge",
    detail: "Edge +6.2% after injury update",
    priorityScore: 61,
    impact: { runwayDelta: 1 },
    actions: ["Simulate", "Explain", "Open"],
    links: [{ entityId: "play-lakers", entityType: "play" }],
  },
];

const contextById = new Map<string, CanvasContext>();

function buildTimeline(baseId: string, label: string): TimelineEntry[] {
  const now = new Date();
  return [
    {
      id: `${baseId}-timeline-1`,
      date: subMinutes(now, 120).toISOString(),
      label: `${label} flagged`,
      detail: "System raised attention item",
      status: "completed",
    },
    {
      id: `${baseId}-timeline-2`,
      date: now.toISOString(),
      label: "Review in Command Bridge",
      detail: "Awaiting decision",
      status: "scheduled",
    },
    {
      id: `${baseId}-timeline-3`,
      date: addMinutes(now, 45).toISOString(),
      label: "Auto follow-up",
      detail: "Nudge planned if no action",
      status: "atRisk",
    },
  ];
}

function seedContexts() {
  contextById.set(
    "Electric Co. payment due",
    {
      summary: {
        title: "Electric Co. payment due",
        subtitle: "$182 · due in 2 days · autopay disabled",
        impact: { runwayDays: -3 },
      },
      timeline: buildTimeline("bill-electric", "Bill"),
      cashflow: {
        variance: 4,
        burnRate: 6200,
        transactions: [
          {
            id: "txn-electric-last",
            postedAt: subMinutes(new Date(), 1440).toISOString(),
            amount: 182,
            category: "Utilities",
            status: "cleared",
            memo: "Last month paid",
          },
          {
            id: "txn-electric-forecast",
            postedAt: addMinutes(new Date(), 2880).toISOString(),
            amount: 186,
            category: "Utilities",
            status: "forecast",
            memo: "Forecast next",
          },
        ],
      },
      docs: [
        {
          id: "doc-electric-statement",
          name: "Statement Mar",
          kind: "invoice",
          uploadedAt: formatISO(subMinutes(new Date(), 60)),
          link: "#",
        },
      ],
      people: [
        {
          id: "contact-utility",
          name: "Utility support",
          role: "Vendor",
          reachableVia: ["phone", "email"],
          preferredChannel: "email",
        },
      ],
      rules: [
        {
          id: "rule-bill-notify",
          name: "Alert if utilities unpaid 3d",
          status: "enabled",
          description: "Sends nudge and raises queue item",
          lastRunAt: subMinutes(new Date(), 5).toISOString(),
          hitCount: 12,
        },
      ],
      scenarios: [
        {
          id: "scenario-pay-now",
          title: "Pay now",
          description: "Reduces runway by 3 days but clears queue",
          runwayDelta: -3,
        },
        {
          id: "scenario-schedule",
          title: "Schedule Friday",
          description: "Keeps runway neutral; increases burn variance",
          burnDelta: 1.5,
        },
      ],
      explain: [
        "Bill flagged due to autopay disabled",
        "Runway impact computed from cash forecast",
      ],
    }
  );

  contextById.set(
    "Emergency fund behind pace",
    {
      summary: {
        title: "Emergency fund behind pace",
        subtitle: "Target $25k · currently $18k",
        impact: { goalEtaDeltaDays: -14 },
      },
      timeline: buildTimeline("goal-emergency", "Goal"),
      cashflow: {
        variance: 3,
        burnRate: 5800,
        transactions: [
          {
            id: "txn-savings-boost",
            postedAt: subMinutes(new Date(), 720).toISOString(),
            amount: 500,
            category: "Transfer",
            status: "cleared",
            memo: "Transfer to savings",
          },
        ],
      },
      docs: [
        {
          id: "doc-goal-plan",
          name: "Goal planning worksheet",
          kind: "other",
          uploadedAt: subMinutes(new Date(), 7200).toISOString(),
        },
      ],
      people: [
        {
          id: "contact-beno",
          name: "Beno",
          role: "Owner",
          reachableVia: ["sms", "email"],
        },
        {
          id: "contact-leo",
          name: "Leo",
          role: "Household",
          reachableVia: ["sms"],
        },
      ],
      rules: [
        {
          id: "rule-goal-variance",
          name: "Alert if goal trending behind",
          status: "enabled",
          description: "Triggers when ETA slips",
          lastRunAt: subMinutes(new Date(), 20).toISOString(),
          hitCount: 4,
        },
      ],
      scenarios: [
        {
          id: "scenario-allocate-300",
          title: "Allocate $300",
          description: "ETA moves forward 2 weeks",
          goalEtaDeltaDays: -14,
        },
        {
          id: "scenario-sweep-bonus",
          title: "Sweep bonus",
          description: "Runway -1 day; goal complete",
          runwayDelta: -1,
        },
      ],
      explain: [
        "Goal slip detected from last month trend",
        "Personal weight high because tagged 'safety'",
      ],
    }
  );

  contextById.set(
    "Levothyroxine dose overdue",
    {
      summary: {
        title: "Levothyroxine dose overdue",
        subtitle: "Missed 30 minutes",
        impact: { adherence: 2 },
      },
      timeline: buildTimeline("dose-levothyroxine", "Care"),
      cashflow: {
        variance: 0,
        burnRate: 0,
        transactions: [],
      },
      docs: [
        {
          id: "doc-medication-plan",
          name: "Medication schedule",
          kind: "medical",
          uploadedAt: subMinutes(new Date(), 1440).toISOString(),
        },
      ],
      people: [
        {
          id: "contact-dr-carter",
          name: "Dr. Carter",
          role: "Endocrinologist",
          reachableVia: ["portal", "phone"],
        },
      ],
      rules: [
        {
          id: "rule-dose-quiet",
          name: "Bypass quiet hours if >20m overdue",
          status: "enabled",
          description: "Ensures adherence",
          lastRunAt: subMinutes(new Date(), 10).toISOString(),
          hitCount: 18,
        },
      ],
      scenarios: [
        {
          id: "scenario-mark-taken",
          title: "Mark as taken",
          description: "Restores adherence",
          adherenceDelta: 2,
        },
        {
          id: "scenario-snooze",
          title: "Snooze 15m",
          description: "Keeps quiet hours respected",
        },
      ],
      explain: ["Dose overdue threshold reached"],
    }
  );
}

seedContexts();

export type ContextResponse = {
  context: CanvasContext;
};

function removeQueueItem(id: string) {
  queueState = queueState.filter(item => item.id !== id);
}

function pushQueueItem(item: QueueItem) {
  const existing = queueState.find(q => q.id === item.id);
  if (!existing) {
    queueState = [...queueState, item];
  } else {
    queueState = queueState.map(q => (q.id === item.id ? item : q));
  }
  queueState.sort((a, b) => b.priorityScore - a.priorityScore);
}

export function getOverview(): Overview {
  const now = new Date();
  const nextBills = allBills
    .filter((bill) => (bill.dueDate as Date) >= now)
    .sort((a, b) => (a.dueDate as Date).getTime() - (b.dueDate as Date).getTime());

  const savingsProgress = allGoals.length
    ? allGoals.reduce((sum, goal) => sum + goal.current, 0) / allGoals.reduce((sum, goal) => sum + goal.target, 0)
    : 0;

  const topGoals = allGoals
    .sort((a, b) => b.priority.localeCompare(a.priority))
    .slice(0, 3)
    .map((goal) => ({
      id: goal.id,
      name: goal.name,
      percent: Math.round((goal.current / goal.target) * 100),
      eta: (goal.deadline as Date).toISOString(),
    }));

  return {
    netWorth: 185000,
    cashOnHand: { amount: 42000, runwayDays: 128 },
    nextBills: {
      count: nextBills.length,
      total: nextBills.reduce((sum, bill) => sum + bill.amount, 0),
      soonest: nextBills[0]?.dueDate.toString() ?? now.toISOString(),
    },
    monthlyBurn: { actual: 6400, target: 6000 },
    savingsProgress: {
      percent: Math.round(savingsProgress * 100),
      delta: 3, // placeholder
    },
    adherence: { percent30d: 92, onHandDays: 16 },
    goals: { top: topGoals },
    pulse: { games: 3, bestValueScore: 7.6 },
  };
}

export function getQueue(filter?: string): QueueItem[] {
  const normalized = filter?.toLowerCase();
  const filtered = normalized && normalized !== "all"
    ? queueState.filter(item => item.category === normalized)
    : queueState;
  return filtered.sort((a, b) => b.priorityScore - a.priorityScore);
}

export function getContextByQueueItemId(id: string) {
  const item = queueState.find(q => q.id === id);
  if (!item) return null;
  return contextById.get(item.title) ?? null;
}

export function recordContextUpdate(id: string, context: CanvasContext) {
  contextById.set(id, context);
}

export function applyEvents(events: EventRecord[]) {
  const dirty = new Set<string>();

  events.forEach(event => {
    switch (event.type) {
      case "bill.paid": {
        removeQueueItem("bill-electric");
        overviewState.cashOnHand.amount -= Number(event.payload.amount ?? 0);
        overviewState.monthlyBurn.actual += Number(event.payload.amount ?? 0);
        overviewState.nextBills.count = Math.max(0, overviewState.nextBills.count - 1);
        dirty.add("bridge:queue");
        dirty.add("bridge:overview");
        break;
      }
      case "goal.allocated": {
        const allocation = Number(event.payload.amount ?? 0);
        const goal = overviewState.goals.top.find(g => g.id === event.payload.goalId);
        if (goal) {
          goal.percent = Math.min(100, goal.percent + allocation / 300);
        }
        overviewState.savingsProgress.percent = Math.min(100, overviewState.savingsProgress.percent + allocation / 500);
        dirty.add("bridge:overview");
        break;
      }
      case "dose.taken": {
        overviewState.adherence.percent30d = Math.min(100, overviewState.adherence.percent30d + 1);
        removeQueueItem("dose-levothyroxine");
        dirty.add("bridge:overview");
        dirty.add("bridge:queue");
        break;
      }
      case "refill.requested": {
        pushQueueItem({
          id: `refill-${event.payload.medicationId}`,
          kind: "refill",
          category: "care",
          title: "Refill requested",
          detail: "Pharmacy notified",
          priorityScore: 48,
          actions: ["Explain", "Open"],
        });
        dirty.add("bridge:queue");
        break;
      }
      case "doc.linked": {
        dirty.add("bridge:context");
        break;
      }
      case "event.created": {
        dirty.add("bridge:context");
        break;
      }
      case "play.tracked": {
        overviewState.pulse.games += 1;
        dirty.add("bridge:overview");
        break;
      }
      default:
        break;
    }
  });

  if (dirty.size > 0) {
    broadcastProjectionUpdate([...dirty]);
  }
}

export function buildScenarioFromImpact(impact: ImpactPlan["kpiDelta"] | undefined): ScenarioPreview | null {
  if (!impact) return null;
  return {
    id: `scenario-${Math.random().toString(36).slice(2)}`,
    title: "Proposed plan",
    description: "Preview of projected metrics",
    runwayDelta: impact.runwayDays,
    burnDelta: impact.burnDelta,
    goalEtaDeltaDays: impact.goalEtaDeltaDays,
  };
}
