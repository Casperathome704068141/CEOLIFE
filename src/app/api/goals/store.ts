import { randomUUID } from "crypto";
import { getApps, initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import type { Firestore } from "firebase-admin/firestore";
import type {
  AutoFundRule,
  AutomationSuggestion,
  FundingAccount,
  Goal,
  GoalPriority,
  GoalType,
  SimulationInput,
  SimulationResult,
} from "@/lib/goals/types";

const GOAL_COLLECTION = "goals";
const AUTOMATION_COLLECTION = "automations";

let firestore: Firestore | null = null;
const memoryGoals = new Map<string, Goal>();
const memoryAutomations: Array<{ id: string; goalId: string; rule: AutoFundRule & { untilTarget?: boolean; untilDate?: string; note?: string } }> = [];

function getFirestoreAdmin(): Firestore | null {
  if (firestore) return firestore;
  try {
    if (!getApps().length) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (serviceAccount) {
        initializeApp({
          credential: cert(JSON.parse(serviceAccount)),
        });
      } else {
        initializeApp({
          credential: applicationDefault(),
        });
      }
    }
    firestore = getFirestore();
  } catch (error) {
    console.warn("[goals] Falling back to in-memory store", error);
    firestore = null;
  }
  return firestore;
}

function serializeGoal(docId: string, data: FirebaseFirestore.DocumentData): Goal {
  const deadline = data.deadline instanceof Timestamp ? data.deadline.toDate().toISOString() : data.deadline;
  const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt ?? new Date().toISOString();
  const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt ?? createdAt;
  return {
    id: docId,
    name: data.name,
    type: data.type,
    target: data.target,
    current: data.current,
    currency: data.currency,
    deadline,
    priority: data.priority,
    linkedAccount: data.linkedAccount,
    linkedEntity: data.linkedEntity ?? undefined,
    autoFundRule: data.autoFundRule ?? undefined,
    color: data.color ?? undefined,
    notes: data.notes ?? undefined,
    status: data.status ?? undefined,
    archived: data.archived ?? false,
    createdAt,
    updatedAt,
  } as Goal;
}

export async function listGoals(): Promise<Goal[]> {
  const db = getFirestoreAdmin();
  if (!db) {
    return Array.from(memoryGoals.values()).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
  const snapshot = await db.collection(GOAL_COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map(doc => serializeGoal(doc.id, doc.data()));
}

export async function getGoal(goalId: string): Promise<Goal | null> {
  const db = getFirestoreAdmin();
  if (!db) {
    return memoryGoals.get(goalId) ?? null;
  }
  const doc = await db.collection(GOAL_COLLECTION).doc(goalId).get();
  if (!doc.exists) return null;
  return serializeGoal(doc.id, doc.data()!);
}

export async function createGoal(payload: Partial<Goal>): Promise<Goal> {
  const id = payload.id ?? randomUUID();
  const now = Timestamp.now();
  const db = getFirestoreAdmin();
  const data = {
    name: payload.name ?? "Untitled goal",
    type: payload.type ?? ("financial" satisfies GoalType),
    target: payload.target ?? 0,
    current: payload.current ?? 0,
    currency: payload.currency ?? "USD",
    deadline: payload.deadline ? Timestamp.fromDate(new Date(payload.deadline)) : null,
    priority: payload.priority ?? ("medium" satisfies GoalPriority),
    linkedAccount: payload.linkedAccount ?? null,
    linkedEntity: payload.linkedEntity ?? null,
    autoFundRule: payload.autoFundRule ?? null,
    color: payload.color ?? null,
    notes: payload.notes ?? "",
    status: payload.status ?? "active",
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
  if (db) {
    await db.collection(GOAL_COLLECTION).doc(id).set(data);
    return serializeGoal(id, data);
  }
  const goal: Goal = {
    id,
    name: data.name,
    type: data.type,
    target: data.target,
    current: data.current,
    currency: data.currency ?? undefined,
    deadline: data.deadline ? new Date(payload.deadline as string).toISOString() : undefined,
    priority: data.priority,
    linkedAccount: payload.linkedAccount,
    linkedEntity: payload.linkedEntity ?? undefined,
    autoFundRule: payload.autoFundRule ?? undefined,
    color: payload.color ?? undefined,
    notes: payload.notes ?? "",
    status: payload.status ?? "active",
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryGoals.set(id, goal);
  return goal;
}

export async function updateGoal(goalId: string, payload: Partial<Goal>): Promise<Goal> {
  const db = getFirestoreAdmin();
  const now = Timestamp.now();
  if (db) {
    const docRef = db.collection(GOAL_COLLECTION).doc(goalId);
    const updateData: Record<string, unknown> = {
      ...payload,
      updatedAt: now,
    };
    if (payload.deadline !== undefined) {
      updateData.deadline = payload.deadline ? Timestamp.fromDate(new Date(payload.deadline)) : null;
    }
    if (payload.linkedEntity === undefined) {
      // keep existing value
    } else {
      updateData.linkedEntity = payload.linkedEntity ?? null;
    }
    await docRef.set(updateData, { merge: true });
    const updated = await docRef.get();
    return serializeGoal(updated.id, updated.data()!);
  }
  const existing = memoryGoals.get(goalId);
  if (!existing) throw new Error("Goal not found");
  const updated: Goal = {
    ...existing,
    ...payload,
    deadline: payload.deadline ?? existing.deadline,
    updatedAt: new Date().toISOString(),
  };
  memoryGoals.set(goalId, updated);
  return updated;
}

export async function archiveGoal(goalId: string): Promise<void> {
  const db = getFirestoreAdmin();
  if (db) {
    await db.collection(GOAL_COLLECTION).doc(goalId).set({ archived: true, status: "archived", updatedAt: Timestamp.now() }, { merge: true });
    return;
  }
  const existing = memoryGoals.get(goalId);
  if (existing) {
    memoryGoals.set(goalId, { ...existing, archived: true, status: "archived", updatedAt: new Date().toISOString() });
  }
}

export async function fundGoal(goalId: string, amount: number): Promise<Goal> {
  if (Number.isNaN(amount) || amount <= 0) throw new Error("Amount must be positive");
  const db = getFirestoreAdmin();
  if (db) {
    const docRef = db.collection(GOAL_COLLECTION).doc(goalId);
    await docRef.set(
      {
        current: FieldValue.increment(amount),
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    );
    const snapshot = await docRef.get();
    return serializeGoal(snapshot.id, snapshot.data()!);
  }
  const existing = memoryGoals.get(goalId);
  if (!existing) throw new Error("Goal not found");
  const updated: Goal = {
    ...existing,
    current: existing.current + amount,
    updatedAt: new Date().toISOString(),
  };
  memoryGoals.set(goalId, updated);
  return updated;
}

export async function upsertAutoFundRule(
  goalId: string,
  payload: AutoFundRule & { untilTarget?: boolean; untilDate?: string; note?: string },
): Promise<{ automationId: string; goal: Goal }> {
  const automationId = randomUUID();
  const db = getFirestoreAdmin();
  if (db) {
    await db.collection(AUTOMATION_COLLECTION).doc(automationId).set({
      type: "autoFund",
      goalId,
      trigger: { type: "cron", freq: payload.frequency },
      action: { transfer: payload.amount, sourceAccountId: payload.sourceAccountId },
      meta: { untilTarget: payload.untilTarget ?? true, untilDate: payload.untilDate ?? null, note: payload.note ?? null },
      enabled: true,
      createdAt: Timestamp.now(),
    });
    await db.collection(GOAL_COLLECTION).doc(goalId).set({ autoFundRule: payload, updatedAt: Timestamp.now() }, { merge: true });
    const updated = await getGoal(goalId);
    if (!updated) throw new Error("Goal not found after automation");
    return { automationId, goal: updated };
  }
  memoryAutomations.push({ id: automationId, goalId, rule: payload });
  const existing = memoryGoals.get(goalId);
  if (!existing) throw new Error("Goal not found");
  const updatedGoal = { ...existing, autoFundRule: payload, updatedAt: new Date().toISOString() };
  memoryGoals.set(goalId, updatedGoal);
  return { automationId, goal: updatedGoal };
}

function computeSimulation(goal: Goal, input: SimulationInput): SimulationResult {
  const monthlyContribution = input.weeklyContribution * (52 / 12) * (1 + input.incomeChangePct / 100);
  const points: { monthLabel: string; projectedTotal: number; contribution: number }[] = [];
  let current = goal.current;
  let month = 0;
  const maxMonths = 60;

  while (current < goal.target && month < maxMonths) {
    current += monthlyContribution;
    month += 1;
    points.push({ monthLabel: `M${month}`, projectedTotal: Number(current.toFixed(2)), contribution: Number(monthlyContribution.toFixed(2)) });
  }

  if (points.length === 0) {
    points.push({ monthLabel: "Now", projectedTotal: goal.current, contribution: 0 });
  }

  const reachDate = new Date();
  reachDate.setMonth(reachDate.getMonth() + month);

  return {
    points,
    monthsToTarget: month,
    reachDate: reachDate.toISOString(),
  };
}

export async function simulateGoal(goalId: string, input: SimulationInput): Promise<SimulationResult> {
  const goal = await getGoal(goalId);
  if (!goal) throw new Error("Goal not found");
  return computeSimulation(goal, input);
}

const fallbackFundingAccounts: FundingAccount[] = [
  { id: "plaid-checking", name: "Checking • 5231", balance: 8200, institution: "Royal Bank", type: "checking", currency: "USD" },
  { id: "plaid-savings", name: "High Yield • 9944", balance: 15200, institution: "Ally", type: "savings", currency: "USD" },
  { id: "plaid-invest", name: "Invest • 7710", balance: 6400, institution: "Wealthsimple", type: "investment", currency: "USD" },
];

export async function listFundingAccounts(): Promise<FundingAccount[]> {
  return fallbackFundingAccounts;
}

export async function computeAutomationSuggestion(): Promise<AutomationSuggestion | null> {
  const goals = await listGoals();
  const atRisk = goals
    .filter(goal => !goal.archived && goal.current < goal.target)
    .sort((a, b) => {
      const deadlineA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const deadlineB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return deadlineA - deadlineB;
    });
  const targetGoal = atRisk[0];
  if (!targetGoal) return null;
  const remaining = targetGoal.target - targetGoal.current;
  const weeksLeft = targetGoal.deadline ? Math.max(1, Math.round((new Date(targetGoal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7))) : 16;
  const recommendedIncrease = Math.max(10, Math.round(remaining / weeksLeft / 10) * 10);
  return {
    id: `suggest-${targetGoal.id}`,
    goalId: targetGoal.id,
    headline: `Boost ${targetGoal.name} by $${recommendedIncrease}/week to stay on track`,
    detail: `You're currently on pace to miss the ${targetGoal.deadline ? new Date(targetGoal.deadline).toLocaleDateString() : "target"}. Beno recommends a ${recommendedIncrease > 0 ? `$${recommendedIncrease}` : "small"} bump per cycle.`,
    recommendedIncrease,
    cta: {
      applyLabel: "Apply rule",
      simulateLabel: "Simulate new plan",
    },
  };
}
