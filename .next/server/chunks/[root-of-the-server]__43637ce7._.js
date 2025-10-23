module.exports = {

"[project]/.next-internal/server/app/api/goals/funding-accounts/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("firebase-admin/app");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("firebase-admin/firestore");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/app/api/goals/store.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "archiveGoal": (()=>archiveGoal),
    "computeAutomationSuggestion": (()=>computeAutomationSuggestion),
    "createGoal": (()=>createGoal),
    "fundGoal": (()=>fundGoal),
    "getGoal": (()=>getGoal),
    "listFundingAccounts": (()=>listFundingAccounts),
    "listGoals": (()=>listGoals),
    "simulateGoal": (()=>simulateGoal),
    "updateGoal": (()=>updateGoal),
    "upsertAutoFundRule": (()=>upsertAutoFundRule)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
const GOAL_COLLECTION = "goals";
const AUTOMATION_COLLECTION = "automations";
let firestore = null;
const memoryGoals = new Map();
const memoryAutomations = [];
function getFirestoreAdmin() {
    if (firestore) return firestore;
    try {
        if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["getApps"])().length) {
            const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
            if (serviceAccount) {
                (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["initializeApp"])({
                    credential: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["cert"])(JSON.parse(serviceAccount))
                });
            } else {
                (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["initializeApp"])({
                    credential: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["applicationDefault"])()
                });
            }
        }
        firestore = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["getFirestore"])();
    } catch (error) {
        console.warn("[goals] Falling back to in-memory store", error);
        firestore = null;
    }
    return firestore;
}
function serializeGoal(docId, data) {
    const deadline = data.deadline instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"] ? data.deadline.toDate().toISOString() : data.deadline;
    const createdAt = data.createdAt instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"] ? data.createdAt.toDate().toISOString() : data.createdAt ?? new Date().toISOString();
    const updatedAt = data.updatedAt instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"] ? data.updatedAt.toDate().toISOString() : data.updatedAt ?? createdAt;
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
        updatedAt
    };
}
async function listGoals() {
    const db = getFirestoreAdmin();
    if (!db) {
        return Array.from(memoryGoals.values()).sort((a, b)=>new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    const snapshot = await db.collection(GOAL_COLLECTION).orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc)=>serializeGoal(doc.id, doc.data()));
}
async function getGoal(goalId) {
    const db = getFirestoreAdmin();
    if (!db) {
        return memoryGoals.get(goalId) ?? null;
    }
    const doc = await db.collection(GOAL_COLLECTION).doc(goalId).get();
    if (!doc.exists) return null;
    return serializeGoal(doc.id, doc.data());
}
async function createGoal(payload) {
    const id = payload.id ?? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
    const now = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"].now();
    const db = getFirestoreAdmin();
    const data = {
        name: payload.name ?? "Untitled goal",
        type: payload.type ?? "financial",
        target: payload.target ?? 0,
        current: payload.current ?? 0,
        currency: payload.currency ?? "USD",
        deadline: payload.deadline ? __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"].fromDate(new Date(payload.deadline)) : null,
        priority: payload.priority ?? "medium",
        linkedAccount: payload.linkedAccount ?? null,
        linkedEntity: payload.linkedEntity ?? null,
        autoFundRule: payload.autoFundRule ?? null,
        color: payload.color ?? null,
        notes: payload.notes ?? "",
        status: payload.status ?? "active",
        archived: false,
        createdAt: now,
        updatedAt: now
    };
    if (db) {
        await db.collection(GOAL_COLLECTION).doc(id).set(data);
        return serializeGoal(id, data);
    }
    const goal = {
        id,
        name: data.name,
        type: data.type,
        target: data.target,
        current: data.current,
        currency: data.currency ?? undefined,
        deadline: data.deadline ? new Date(payload.deadline).toISOString() : undefined,
        priority: data.priority,
        linkedAccount: payload.linkedAccount,
        linkedEntity: payload.linkedEntity ?? undefined,
        autoFundRule: payload.autoFundRule ?? undefined,
        color: payload.color ?? undefined,
        notes: payload.notes ?? "",
        status: payload.status ?? "active",
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    memoryGoals.set(id, goal);
    return goal;
}
async function updateGoal(goalId, payload) {
    const db = getFirestoreAdmin();
    const now = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"].now();
    if (db) {
        const docRef = db.collection(GOAL_COLLECTION).doc(goalId);
        const updateData = {
            ...payload,
            updatedAt: now
        };
        if (payload.deadline !== undefined) {
            updateData.deadline = payload.deadline ? __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"].fromDate(new Date(payload.deadline)) : null;
        }
        if (payload.linkedEntity === undefined) {
        // keep existing value
        } else {
            updateData.linkedEntity = payload.linkedEntity ?? null;
        }
        await docRef.set(updateData, {
            merge: true
        });
        const updated = await docRef.get();
        return serializeGoal(updated.id, updated.data());
    }
    const existing = memoryGoals.get(goalId);
    if (!existing) throw new Error("Goal not found");
    const updated = {
        ...existing,
        ...payload,
        deadline: payload.deadline ?? existing.deadline,
        updatedAt: new Date().toISOString()
    };
    memoryGoals.set(goalId, updated);
    return updated;
}
async function archiveGoal(goalId) {
    const db = getFirestoreAdmin();
    if (db) {
        await db.collection(GOAL_COLLECTION).doc(goalId).set({
            archived: true,
            status: "archived",
            updatedAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"].now()
        }, {
            merge: true
        });
        return;
    }
    const existing = memoryGoals.get(goalId);
    if (existing) {
        memoryGoals.set(goalId, {
            ...existing,
            archived: true,
            status: "archived",
            updatedAt: new Date().toISOString()
        });
    }
}
async function fundGoal(goalId, amount) {
    if (Number.isNaN(amount) || amount <= 0) throw new Error("Amount must be positive");
    const db = getFirestoreAdmin();
    if (db) {
        const docRef = db.collection(GOAL_COLLECTION).doc(goalId);
        await docRef.set({
            current: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["FieldValue"].increment(amount),
            updatedAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"].now()
        }, {
            merge: true
        });
        const snapshot = await docRef.get();
        return serializeGoal(snapshot.id, snapshot.data());
    }
    const existing = memoryGoals.get(goalId);
    if (!existing) throw new Error("Goal not found");
    const updated = {
        ...existing,
        current: existing.current + amount,
        updatedAt: new Date().toISOString()
    };
    memoryGoals.set(goalId, updated);
    return updated;
}
async function upsertAutoFundRule(goalId, payload) {
    const automationId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
    const db = getFirestoreAdmin();
    if (db) {
        await db.collection(AUTOMATION_COLLECTION).doc(automationId).set({
            type: "autoFund",
            goalId,
            trigger: {
                type: "cron",
                freq: payload.frequency
            },
            action: {
                transfer: payload.amount,
                sourceAccountId: payload.sourceAccountId
            },
            meta: {
                untilTarget: payload.untilTarget ?? true,
                untilDate: payload.untilDate ?? null,
                note: payload.note ?? null
            },
            enabled: true,
            createdAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"].now()
        });
        await db.collection(GOAL_COLLECTION).doc(goalId).set({
            autoFundRule: payload,
            updatedAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"].now()
        }, {
            merge: true
        });
        const updated = await getGoal(goalId);
        if (!updated) throw new Error("Goal not found after automation");
        return {
            automationId,
            goal: updated
        };
    }
    memoryAutomations.push({
        id: automationId,
        goalId,
        rule: payload
    });
    const existing = memoryGoals.get(goalId);
    if (!existing) throw new Error("Goal not found");
    const updatedGoal = {
        ...existing,
        autoFundRule: payload,
        updatedAt: new Date().toISOString()
    };
    memoryGoals.set(goalId, updatedGoal);
    return {
        automationId,
        goal: updatedGoal
    };
}
function computeSimulation(goal, input) {
    const monthlyContribution = input.weeklyContribution * (52 / 12) * (1 + input.incomeChangePct / 100);
    const points = [];
    let current = goal.current;
    let month = 0;
    const maxMonths = 60;
    while(current < goal.target && month < maxMonths){
        current += monthlyContribution;
        month += 1;
        points.push({
            monthLabel: `M${month}`,
            projectedTotal: Number(current.toFixed(2)),
            contribution: Number(monthlyContribution.toFixed(2))
        });
    }
    if (points.length === 0) {
        points.push({
            monthLabel: "Now",
            projectedTotal: goal.current,
            contribution: 0
        });
    }
    const reachDate = new Date();
    reachDate.setMonth(reachDate.getMonth() + month);
    return {
        points,
        monthsToTarget: month,
        reachDate: reachDate.toISOString()
    };
}
async function simulateGoal(goalId, input) {
    const goal = await getGoal(goalId);
    if (!goal) throw new Error("Goal not found");
    return computeSimulation(goal, input);
}
const fallbackFundingAccounts = [
    {
        id: "plaid-checking",
        name: "Checking • 5231",
        balance: 8200,
        institution: "Royal Bank",
        type: "checking",
        currency: "USD"
    },
    {
        id: "plaid-savings",
        name: "High Yield • 9944",
        balance: 15200,
        institution: "Ally",
        type: "savings",
        currency: "USD"
    },
    {
        id: "plaid-invest",
        name: "Invest • 7710",
        balance: 6400,
        institution: "Wealthsimple",
        type: "investment",
        currency: "USD"
    }
];
async function listFundingAccounts() {
    return fallbackFundingAccounts;
}
async function computeAutomationSuggestion() {
    const goals = await listGoals();
    const atRisk = goals.filter((goal)=>!goal.archived && goal.current < goal.target).sort((a, b)=>{
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
            simulateLabel: "Simulate new plan"
        }
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/api/goals/funding-accounts/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$goals$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/goals/store.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$goals$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$goals$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
async function GET() {
    const accounts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$goals$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listFundingAccounts"])();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(accounts);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__43637ce7._.js.map