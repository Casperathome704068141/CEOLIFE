module.exports = {

"[project]/.next-internal/server/app/api/pulse/odds/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/lib/pulse/valueScore.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "valueScore": (()=>valueScore),
    "valueScoreBand": (()=>valueScoreBand)
});
function valueScore(i) {
    const edge = i.marketAvgImplied - i.implied;
    const momentum = Math.tanh(i.lineMove / 2);
    const contrarian = 0.5 - Math.abs(i.sentimentSkew - 0.5);
    const base = 5 + 20 * edge + 2 * momentum + 5 * contrarian + 5 * i.weatherImpact + 3 * (i.formIndex - 0.5);
    return Math.max(0, Math.min(10, base));
}
function valueScoreBand(score) {
    if (score >= 8) return {
        label: "rare",
        className: "text-emerald-400"
    };
    if (score >= 6) return {
        label: "opportunity",
        className: "text-lime-400"
    };
    if (score >= 3) return {
        label: "caution",
        className: "text-amber-400"
    };
    return {
        label: "neutral",
        className: "text-slate-400"
    };
}
}}),
"[project]/src/app/api/pulse/odds/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pulse$2f$valueScore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/pulse/valueScore.ts [app-route] (ecmascript)");
;
const baseOdds = [
    {
        id: "nba-lal-bos-moneyline",
        gameId: "nba-lal-bos",
        league: "NBA",
        market: "moneyline",
        selection: "Lakers",
        line: null,
        price: 1.85,
        marketAvg: 1.8,
        implied: 0.54,
        delta: 0.04,
        books: [
            {
                name: "Book A",
                price: 1.85
            },
            {
                name: "Book B",
                price: 1.81
            },
            {
                name: "Book C",
                price: 1.79
            }
        ],
        inputs: {
            implied: 0.54,
            marketAvgImplied: 0.56,
            lineMove: 0.8,
            formIndex: 0.64,
            weatherImpact: 0.02,
            sentimentSkew: 0.42
        }
    },
    {
        id: "nfl-kc-buf-spread",
        gameId: "nfl-kc-buf",
        league: "NFL",
        market: "spread",
        selection: "Chiefs -3.5",
        line: -3.5,
        price: -110,
        marketAvg: -115,
        implied: 0.52,
        delta: 0.03,
        books: [
            {
                name: "Book A",
                price: -110,
                line: -3.5
            },
            {
                name: "Book B",
                price: -112,
                line: -3.5
            },
            {
                name: "Book C",
                price: -118,
                line: -4
            }
        ],
        inputs: {
            implied: 0.52,
            marketAvgImplied: 0.54,
            lineMove: 1.1,
            formIndex: 0.72,
            weatherImpact: -0.01,
            sentimentSkew: 0.65
        }
    },
    {
        id: "epl-ars-che-total",
        gameId: "epl-ars-che",
        league: "EPL",
        market: "total",
        selection: "Over 2.5",
        line: 2.5,
        price: 1.95,
        marketAvg: 1.9,
        implied: 0.51,
        delta: 0.05,
        books: [
            {
                name: "Book A",
                price: 1.95,
                line: 2.5
            },
            {
                name: "Book B",
                price: 1.91,
                line: 2.5
            },
            {
                name: "Book C",
                price: 1.88,
                line: 2.75
            }
        ],
        inputs: {
            implied: 0.51,
            marketAvgImplied: 0.53,
            lineMove: 0.4,
            formIndex: 0.61,
            weatherImpact: -0.03,
            sentimentSkew: 0.38
        }
    },
    {
        id: "nhl-nyr-col-moneyline",
        gameId: "nhl-nyr-col",
        league: "NHL",
        market: "moneyline",
        selection: "Rangers",
        line: null,
        price: 1.92,
        marketAvg: 1.88,
        implied: 0.52,
        delta: 0.04,
        books: [
            {
                name: "Book A",
                price: 1.92
            },
            {
                name: "Book B",
                price: 1.89
            },
            {
                name: "Book C",
                price: 1.87
            }
        ],
        inputs: {
            implied: 0.52,
            marketAvgImplied: 0.54,
            lineMove: 0.6,
            formIndex: 0.58,
            weatherImpact: 0,
            sentimentSkew: 0.46
        }
    }
];
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const leaguesParam = searchParams.get("leagues");
    const leagues = leaguesParam ? leaguesParam.split(",").map((league)=>league.trim()).filter(Boolean) : undefined;
    const odds = baseOdds.filter((row)=>leagues ? leagues.includes(row.league) : true).map(({ inputs, ...row })=>({
            ...row,
            lineMove: inputs.lineMove,
            formIndex: inputs.formIndex,
            weatherImpact: inputs.weatherImpact,
            sentimentSkew: inputs.sentimentSkew,
            valueScore: Number((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pulse$2f$valueScore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["valueScore"])(inputs).toFixed(2))
        }));
    return Response.json({
        odds
    });
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__a1e1943c._.js.map