module.exports = {

"[project]/.next-internal/server/app/api/bridge/context/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/lib/core/sse.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "broadcastProjectionUpdate": (()=>broadcastProjectionUpdate),
    "registerClient": (()=>registerClient)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
const clients = new Map();
function registerClient(send) {
    const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
    const client = {
        id,
        send
    };
    clients.set(id, client);
    return ()=>{
        clients.delete(id);
    };
}
function broadcastProjectionUpdate(keys) {
    const payload = JSON.stringify({
        keys
    });
    for (const client of clients.values()){
        client.send(`data: ${payload}\n\n`);
    }
}
}}),
"[project]/src/lib/core/projections.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "applyEvents": (()=>applyEvents),
    "buildScenarioFromImpact": (()=>buildScenarioFromImpact),
    "getContextByQueueItemId": (()=>getContextByQueueItemId),
    "getOverview": (()=>getOverview),
    "getQueue": (()=>getQueue),
    "recordContextUpdate": (()=>recordContextUpdate)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/addMinutes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/formatISO.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/subMinutes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$core$2f$sse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/core/sse.ts [app-route] (ecmascript)");
;
;
const overviewState = {
    netWorth: 185000,
    cashOnHand: {
        amount: 42000,
        runwayDays: 128
    },
    nextBills: {
        count: 5,
        total: 3200,
        soonest: new Date().toISOString()
    },
    monthlyBurn: {
        actual: 6400,
        target: 6000
    },
    savingsProgress: {
        percent: 58,
        delta: 3
    },
    adherence: {
        percent30d: 92,
        onHandDays: 16
    },
    goals: {
        top: [
            {
                id: "goal-emergency",
                name: "Emergency fund",
                percent: 72,
                eta: "2025-04-30"
            },
            {
                id: "goal-rental",
                name: "Rental upgrade",
                percent: 34,
                eta: "2025-12-01"
            },
            {
                id: "goal-pulse",
                name: "Pulse bankroll",
                percent: 55
            }
        ]
    },
    pulse: {
        games: 3,
        bestValueScore: 7.6
    }
};
let queueState = [
    {
        id: "bill-electric",
        kind: "bill",
        category: "finance",
        title: "Electric Co. payment due",
        detail: "Due in 2 days · autopay off",
        priorityScore: 86,
        impact: {
            runwayDelta: -3
        },
        actions: [
            "Accept",
            "Schedule",
            "Nudge",
            "Explain",
            "Open"
        ],
        links: [
            {
                entityId: "bill-electric",
                entityType: "bill"
            },
            {
                entityId: "doc-electric-statement",
                entityType: "document"
            }
        ]
    },
    {
        id: "goal-emergency",
        kind: "goalUnderfunded",
        category: "goals",
        title: "Emergency fund behind pace",
        detail: "Allocate $300 to recover 2 weeks",
        priorityScore: 74,
        impact: {
            goalEtaDeltaDays: -14
        },
        actions: [
            "Accept",
            "Simulate",
            "Explain"
        ],
        links: [
            {
                entityId: "goal-emergency",
                entityType: "goal"
            }
        ]
    },
    {
        id: "dose-levothyroxine",
        kind: "doseOverdue",
        category: "care",
        title: "Levothyroxine dose overdue",
        detail: "Missed 30m · safety bypass active",
        priorityScore: 92,
        impact: {
            adherenceDelta: 2
        },
        actions: [
            "Accept",
            "Nudge",
            "Explain"
        ],
        links: [
            {
                entityId: "med-levothyroxine",
                entityType: "medication"
            },
            {
                entityId: "dose-levothyroxine",
                entityType: "dose"
            }
        ]
    },
    {
        id: "weather-storm",
        kind: "weatherAlert",
        category: "home",
        title: "Severe weather incoming",
        detail: "Wind advisory overlaps soccer practice",
        priorityScore: 65,
        actions: [
            "Schedule",
            "Explain",
            "Open"
        ],
        links: [
            {
                entityId: "event-soccer",
                entityType: "event"
            }
        ]
    },
    {
        id: "pulse-value",
        kind: "valuePlay",
        category: "pulse",
        title: "Lakers -3.5 model edge",
        detail: "Edge +6.2% after injury update",
        priorityScore: 61,
        impact: {
            runwayDelta: 1
        },
        actions: [
            "Simulate",
            "Explain",
            "Open"
        ],
        links: [
            {
                entityId: "play-lakers",
                entityType: "play"
            }
        ]
    }
];
const contextById = new Map();
function buildTimeline(baseId, label) {
    const now = new Date();
    return [
        {
            id: `${baseId}-timeline-1`,
            date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subMinutes"])(now, 120).toISOString(),
            label: `${label} flagged`,
            detail: "System raised attention item",
            status: "completed"
        },
        {
            id: `${baseId}-timeline-2`,
            date: now.toISOString(),
            label: "Review in Command Bridge",
            detail: "Awaiting decision",
            status: "scheduled"
        },
        {
            id: `${baseId}-timeline-3`,
            date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addMinutes"])(now, 45).toISOString(),
            label: "Auto follow-up",
            detail: "Nudge planned if no action",
            status: "atRisk"
        }
    ];
}
function seedContexts() {
    contextById.set("Electric Co. payment due", {
        summary: {
            title: "Electric Co. payment due",
            subtitle: "$182 · due in 2 days · autopay disabled",
            impact: {
                runwayDays: -3
            }
        },
        timeline: buildTimeline("bill-electric", "Bill"),
        cashflow: {
            variance: 4,
            burnRate: 6200,
            transactions: [
                {
                    id: "txn-electric-last",
                    postedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subMinutes"])(new Date(), 1440).toISOString(),
                    amount: 182,
                    category: "Utilities",
                    status: "cleared",
                    memo: "Last month paid"
                },
                {
                    id: "txn-electric-forecast",
                    postedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addMinutes"])(new Date(), 2880).toISOString(),
                    amount: 186,
                    category: "Utilities",
                    status: "forecast",
                    memo: "Forecast next"
                }
            ]
        },
        docs: [
            {
                id: "doc-electric-statement",
                name: "Statement Mar",
                kind: "invoice",
                uploadedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subMinutes"])(new Date(), 60)),
                link: "#"
            }
        ],
        people: [
            {
                id: "contact-utility",
                name: "Utility support",
                role: "Vendor",
                reachableVia: [
                    "phone",
                    "email"
                ],
                preferredChannel: "email"
            }
        ],
        rules: [
            {
                id: "rule-bill-notify",
                name: "Alert if utilities unpaid 3d",
                status: "enabled",
                description: "Sends nudge and raises queue item",
                lastRunAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subMinutes"])(new Date(), 5).toISOString(),
                hitCount: 12
            }
        ],
        scenarios: [
            {
                id: "scenario-pay-now",
                title: "Pay now",
                description: "Reduces runway by 3 days but clears queue",
                runwayDelta: -3
            },
            {
                id: "scenario-schedule",
                title: "Schedule Friday",
                description: "Keeps runway neutral; increases burn variance",
                burnDelta: 1.5
            }
        ],
        explain: [
            "Bill flagged due to autopay disabled",
            "Runway impact computed from cash forecast"
        ]
    });
    contextById.set("Emergency fund behind pace", {
        summary: {
            title: "Emergency fund behind pace",
            subtitle: "Target $25k · currently $18k",
            impact: {
                goalEtaDeltaDays: -14
            }
        },
        timeline: buildTimeline("goal-emergency", "Goal"),
        cashflow: {
            variance: 3,
            burnRate: 5800,
            transactions: [
                {
                    id: "txn-savings-boost",
                    postedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subMinutes"])(new Date(), 720).toISOString(),
                    amount: 500,
                    category: "Transfer",
                    status: "cleared",
                    memo: "Transfer to savings"
                }
            ]
        },
        docs: [
            {
                id: "doc-goal-plan",
                name: "Goal planning worksheet",
                kind: "other",
                uploadedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subMinutes"])(new Date(), 7200).toISOString()
            }
        ],
        people: [
            {
                id: "contact-beno",
                name: "Beno",
                role: "Owner",
                reachableVia: [
                    "sms",
                    "email"
                ]
            },
            {
                id: "contact-leo",
                name: "Leo",
                role: "Household",
                reachableVia: [
                    "sms"
                ]
            }
        ],
        rules: [
            {
                id: "rule-goal-variance",
                name: "Alert if goal trending behind",
                status: "enabled",
                description: "Triggers when ETA slips",
                lastRunAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subMinutes"])(new Date(), 20).toISOString(),
                hitCount: 4
            }
        ],
        scenarios: [
            {
                id: "scenario-allocate-300",
                title: "Allocate $300",
                description: "ETA moves forward 2 weeks",
                goalEtaDeltaDays: -14
            },
            {
                id: "scenario-sweep-bonus",
                title: "Sweep bonus",
                description: "Runway -1 day; goal complete",
                runwayDelta: -1
            }
        ],
        explain: [
            "Goal slip detected from last month trend",
            "Personal weight high because tagged 'safety'"
        ]
    });
    contextById.set("Levothyroxine dose overdue", {
        summary: {
            title: "Levothyroxine dose overdue",
            subtitle: "Missed 30 minutes",
            impact: {
                adherence: 2
            }
        },
        timeline: buildTimeline("dose-levothyroxine", "Care"),
        cashflow: {
            variance: 0,
            burnRate: 0,
            transactions: []
        },
        docs: [
            {
                id: "doc-medication-plan",
                name: "Medication schedule",
                kind: "medical",
                uploadedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subMinutes"])(new Date(), 1440).toISOString()
            }
        ],
        people: [
            {
                id: "contact-dr-carter",
                name: "Dr. Carter",
                role: "Endocrinologist",
                reachableVia: [
                    "portal",
                    "phone"
                ]
            }
        ],
        rules: [
            {
                id: "rule-dose-quiet",
                name: "Bypass quiet hours if >20m overdue",
                status: "enabled",
                description: "Ensures adherence",
                lastRunAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subMinutes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subMinutes"])(new Date(), 10).toISOString(),
                hitCount: 18
            }
        ],
        scenarios: [
            {
                id: "scenario-mark-taken",
                title: "Mark as taken",
                description: "Restores adherence",
                adherenceDelta: 2
            },
            {
                id: "scenario-snooze",
                title: "Snooze 15m",
                description: "Keeps quiet hours respected"
            }
        ],
        explain: [
            "Dose overdue threshold reached"
        ]
    });
}
seedContexts();
function removeQueueItem(id) {
    queueState = queueState.filter((item)=>item.id !== id);
}
function pushQueueItem(item) {
    const existing = queueState.find((q)=>q.id === item.id);
    if (!existing) {
        queueState = [
            ...queueState,
            item
        ];
    } else {
        queueState = queueState.map((q)=>q.id === item.id ? item : q);
    }
    queueState.sort((a, b)=>b.priorityScore - a.priorityScore);
}
function getOverview() {
    return overviewState;
}
function getQueue(filter) {
    const normalized = filter?.toLowerCase();
    const filtered = normalized && normalized !== "all" ? queueState.filter((item)=>item.category === normalized) : queueState;
    return filtered.sort((a, b)=>b.priorityScore - a.priorityScore);
}
function getContextByQueueItemId(id) {
    const item = queueState.find((q)=>q.id === id);
    if (!item) return null;
    return contextById.get(item.title) ?? null;
}
function recordContextUpdate(id, context) {
    contextById.set(id, context);
}
function applyEvents(events) {
    const dirty = new Set();
    events.forEach((event)=>{
        switch(event.type){
            case "bill.paid":
                {
                    removeQueueItem("bill-electric");
                    overviewState.cashOnHand.amount -= Number(event.payload.amount ?? 0);
                    overviewState.monthlyBurn.actual += Number(event.payload.amount ?? 0);
                    overviewState.nextBills.count = Math.max(0, overviewState.nextBills.count - 1);
                    dirty.add("bridge:queue");
                    dirty.add("bridge:overview");
                    break;
                }
            case "goal.allocated":
                {
                    const allocation = Number(event.payload.amount ?? 0);
                    const goal = overviewState.goals.top.find((g)=>g.id === event.payload.goalId);
                    if (goal) {
                        goal.percent = Math.min(100, goal.percent + allocation / 300);
                    }
                    overviewState.savingsProgress.percent = Math.min(100, overviewState.savingsProgress.percent + allocation / 500);
                    dirty.add("bridge:overview");
                    break;
                }
            case "dose.taken":
                {
                    overviewState.adherence.percent30d = Math.min(100, overviewState.adherence.percent30d + 1);
                    removeQueueItem("dose-levothyroxine");
                    dirty.add("bridge:overview");
                    dirty.add("bridge:queue");
                    break;
                }
            case "refill.requested":
                {
                    pushQueueItem({
                        id: `refill-${event.payload.medicationId}`,
                        kind: "refill",
                        category: "care",
                        title: "Refill requested",
                        detail: "Pharmacy notified",
                        priorityScore: 48,
                        actions: [
                            "Explain",
                            "Open"
                        ]
                    });
                    dirty.add("bridge:queue");
                    break;
                }
            case "doc.linked":
                {
                    dirty.add("bridge:context");
                    break;
                }
            case "event.created":
                {
                    dirty.add("bridge:context");
                    break;
                }
            case "play.tracked":
                {
                    overviewState.pulse.games += 1;
                    dirty.add("bridge:overview");
                    break;
                }
            default:
                break;
        }
    });
    if (dirty.size > 0) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$core$2f$sse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["broadcastProjectionUpdate"])([
            ...dirty
        ]);
    }
}
function buildScenarioFromImpact(impact) {
    if (!impact) return null;
    return {
        id: `scenario-${Math.random().toString(36).slice(2)}`,
        title: "Proposed plan",
        description: "Preview of projected metrics",
        runwayDelta: impact.runwayDays,
        burnDelta: impact.burnDelta,
        goalEtaDeltaDays: impact.goalEtaDeltaDays
    };
}
}}),
"[project]/src/app/api/bridge/context/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$core$2f$projections$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/core/projections.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing id"
        }, {
            status: 400
        });
    }
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$core$2f$projections$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getContextByQueueItemId"])(id);
    if (!context) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Not found"
        }, {
            status: 404
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        context
    });
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__6e8335e1._.js.map