module.exports = {

"[project]/.next-internal/server/app/api/household/shopping/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/app/api/household/store.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getHouseholdStore": (()=>getHouseholdStore),
    "setHouseholdStore": (()=>setHouseholdStore)
});
const defaultMembers = [
    {
        id: "m-1",
        name: "Beno",
        relation: "brother",
        phone: "+15550001111",
        roleLabel: "Admin"
    },
    {
        id: "m-2",
        name: "Marcus",
        relation: "parent",
        phone: "+15550002222",
        roleLabel: "Family"
    },
    {
        id: "m-3",
        name: "Luis",
        relation: "guest",
        phone: "+15550003333",
        roleLabel: "Guest"
    }
];
const defaultProfiles = [
    {
        id: "cp-1",
        memberId: "m-1",
        name: "Beno",
        phone: "+15550001111"
    },
    {
        id: "cp-2",
        memberId: "m-2",
        name: "Marcus",
        phone: "+15550002222"
    }
];
const now = new Date();
const defaultMedications = [
    {
        id: "med-1",
        careProfileId: "cp-1",
        name: "Hydroxyurea",
        strengthMg: 500,
        form: "cap",
        dosage: {
            unitsPerDose: 1
        },
        schedule: {
            type: "fixed",
            times: [
                "08:00",
                "20:00"
            ],
            daysOfWeek: [
                1,
                2,
                3,
                4,
                5,
                6,
                0
            ]
        },
        pillsOnHand: 22,
        refillPackSize: 30,
        lowStockThreshold: 10,
        refillsRemaining: 2
    },
    {
        id: "med-2",
        careProfileId: "cp-2",
        name: "Vitamin D",
        strengthMg: 1000,
        form: "tab",
        dosage: {
            unitsPerDose: 1
        },
        schedule: {
            type: "fixed",
            times: [
                "09:00"
            ],
            daysOfWeek: [
                1,
                3,
                5
            ]
        },
        pillsOnHand: 15,
        refillPackSize: 60,
        lowStockThreshold: 6,
        refillsRemaining: 4
    }
];
const defaultDoses = defaultMedications.flatMap((med)=>(med.schedule.times || []).map((time, index)=>{
        const today = new Date();
        const [hour, minute] = time.split(":").map(Number);
        today.setHours(hour ?? 8, minute ?? 0, 0, 0);
        return {
            id: `${med.id}-dose-${index}`,
            medId: med.id,
            scheduledAt: today.toISOString(),
            status: index % 2 === 0 ? "taken" : "due"
        };
    }));
const defaultAppointments = [
    {
        id: "appt-1",
        careProfileId: "cp-1",
        title: "Hematology follow-up",
        type: "specialist",
        start: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        location: "City Hospital",
        provider: "Dr. Singh"
    }
];
const defaultAssets = [
    {
        id: "asset-1",
        name: "Dyson V12",
        category: "appliance",
        condition: "good",
        purchaseDate: new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        warrantyEnd: new Date(now.getTime() + 165 * 24 * 60 * 60 * 1000).toISOString(),
        maintenance: {
            next: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            cadenceDays: 90,
            history: []
        }
    }
];
const defaultShopping = [
    {
        id: "list-1",
        name: "Shared essentials",
        items: [
            {
                id: "item-1",
                label: "Paper towels",
                priority: "med",
                recurring: true,
                isChecked: false
            },
            {
                id: "item-2",
                label: "Laundry detergent",
                priority: "high",
                recurring: true,
                priceTarget: 12,
                isChecked: false
            }
        ]
    }
];
const defaultLedger = [
    {
        id: "ledger-1",
        label: "Groceries",
        amount: 120,
        currency: "USD",
        date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        payer: "Marcus"
    },
    {
        id: "ledger-2",
        label: "Internet bill",
        amount: 80,
        currency: "USD",
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        payer: "Beno"
    }
];
const defaultTickets = [
    {
        id: "ticket-1",
        apartmentId: "apt-1",
        title: "Fix shower handle",
        type: "repair",
        severity: "med",
        status: "open"
    }
];
const defaultMeters = [
    {
        id: "meter-1",
        apartmentId: "apt-1",
        type: "power",
        reading: 2334,
        unit: "kWh",
        takenAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "meter-2",
        apartmentId: "apt-1",
        type: "power",
        reading: 2404,
        unit: "kWh",
        takenAt: now.toISOString()
    }
];
const defaultSettlements = [
    {
        id: "set-1",
        payer: "Beno",
        amount: 200,
        method: "etransfer",
        date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString()
    }
];
function getHouseholdStore() {
    if (!globalThis.__householdStore) {
        globalThis.__householdStore = {
            members: defaultMembers,
            careProfiles: defaultProfiles,
            medications: defaultMedications,
            doses: defaultDoses,
            appointments: defaultAppointments,
            assets: defaultAssets,
            meterReadings: defaultMeters,
            tickets: defaultTickets,
            shoppingLists: defaultShopping,
            ledger: defaultLedger,
            settlements: defaultSettlements
        };
    }
    return globalThis.__householdStore;
}
function setHouseholdStore(store) {
    globalThis.__householdStore = store;
}
}}),
"[project]/src/app/api/household/shopping/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$household$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/household/store.ts [app-route] (ecmascript)");
;
;
;
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$household$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getHouseholdStore"])().shoppingLists);
}
async function POST(request) {
    const body = await request.json();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$household$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getHouseholdStore"])();
    const { action } = body;
    if (action === "addItem") {
        const payload = body.payload;
        const list = store.shoppingLists.find((item)=>item.id === payload.listId);
        if (!list) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Shopping list not found"
            }, {
                status: 404
            });
        }
        const item = {
            id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])(),
            label: payload.label,
            qty: payload.qty,
            priority: payload.priority,
            recurring: payload.recurring,
            priceTarget: payload.priceTarget,
            isChecked: false
        };
        list.items.push(item);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$household$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHouseholdStore"])(store);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(list, {
            status: 201
        });
    }
    if (action === "toggle") {
        const { listId, itemId, payload: togglePayload } = body;
        const list = store.shoppingLists.find((item)=>item.id === listId || item.id === togglePayload?.listId);
        const item = list?.items.find((entry)=>entry.id === itemId || entry.id === togglePayload?.itemId);
        if (list && item) {
            item.isChecked = togglePayload?.checked ?? body.payload?.checked ?? false;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$household$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHouseholdStore"])(store);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(list);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Item not found"
        }, {
            status: 404
        });
    }
    if (action === "priceTarget") {
        const payload = body.payload;
        const list = store.shoppingLists.find((item)=>item.id === payload.listId);
        const item = list?.items.find((entry)=>entry.id === payload.itemId);
        if (item) {
            item.priceTarget = payload.priceTarget;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$household$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHouseholdStore"])(store);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(list);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Item not found"
        }, {
            status: 404
        });
    }
    if (action === "createList") {
        const payload = body.payload;
        const list = {
            id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])(),
            name: payload.name,
            items: []
        };
        store.shoppingLists.push(list);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$household$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHouseholdStore"])(store);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(list, {
            status: 201
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Unsupported action"
    }, {
        status: 400
    });
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__0ba1e626._.js.map