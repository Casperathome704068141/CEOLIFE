module.exports = {

"[project]/.next-internal/server/app/api/pulse/insights/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/app/api/pulse/insights/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
const bestPlays = [
    {
        id: "play-lal-moneyline",
        gameId: "nba-lal-bos",
        league: "NBA",
        market: "moneyline",
        pick: "Lakers ML",
        suggested: 1.85,
        confidence: 0.68,
        rationale: [
            "Home pace boost vs. Celtics back-to-back",
            "Interior matchup favors Davis",
            "Market drifted toward Boston despite injury doubts"
        ],
        valueScore: 7.6,
        momentum: 0.44,
        sparkline: [
            {
                t: "-24h",
                value: 6.4
            },
            {
                t: "-12h",
                value: 6.9
            },
            {
                t: "-6h",
                value: 7.2
            },
            {
                t: "Now",
                value: 7.6
            }
        ]
    },
    {
        id: "play-kc-spread",
        gameId: "nfl-kc-buf",
        league: "NFL",
        market: "spread",
        pick: "Chiefs -3.5",
        suggested: -110,
        confidence: 0.62,
        rationale: [
            "Wind limiting Bills downfield passing",
            "KC red-zone efficiency up 11% last three weeks",
            "Sharp money hit -4 early, book held line"
        ],
        valueScore: 7.1,
        momentum: 0.38,
        sparkline: [
            {
                t: "-24h",
                value: 6.1
            },
            {
                t: "-12h",
                value: 6.6
            },
            {
                t: "-6h",
                value: 6.9
            },
            {
                t: "Now",
                value: 7.1
            }
        ]
    },
    {
        id: "play-ars-over",
        gameId: "epl-ars-che",
        league: "EPL",
        market: "total",
        pick: "Over 2.5",
        suggested: 1.95,
        confidence: 0.58,
        rationale: [
            "Arsenal xG at home 2.1 last five",
            "Chelsea pressing intensity leaves gaps",
            "Forecast showers but mild winds"
        ],
        valueScore: 6.5,
        momentum: 0.31,
        sparkline: [
            {
                t: "-24h",
                value: 5.9
            },
            {
                t: "-12h",
                value: 6.1
            },
            {
                t: "-6h",
                value: 6.3
            },
            {
                t: "Now",
                value: 6.5
            }
        ]
    }
];
const trends = {
    lineMoves: [
        {
            id: "nba-lal-bos",
            t: "-24h",
            value: -3.5,
            label: "Spread"
        },
        {
            id: "nba-lal-bos",
            t: "Now",
            value: -2.5,
            label: "Spread"
        },
        {
            id: "nfl-kc-buf",
            t: "-24h",
            value: -2.5,
            label: "Spread"
        },
        {
            id: "nfl-kc-buf",
            t: "Now",
            value: -3.5,
            label: "Spread"
        },
        {
            id: "epl-ars-che",
            t: "-24h",
            value: 2.5,
            label: "Total"
        },
        {
            id: "epl-ars-che",
            t: "Now",
            value: 2.75,
            label: "Total"
        }
    ],
    momentumHeat: [
        {
            id: "nba-lal-bos",
            label: "Lakers",
            score: 0.68
        },
        {
            id: "nba-lal-bos",
            label: "Celtics",
            score: 0.55
        },
        {
            id: "nfl-kc-buf",
            label: "Chiefs",
            score: 0.62
        },
        {
            id: "nfl-kc-buf",
            label: "Bills",
            score: 0.47
        },
        {
            id: "epl-ars-che",
            label: "Arsenal",
            score: 0.59
        },
        {
            id: "epl-ars-che",
            label: "Chelsea",
            score: 0.52
        }
    ],
    sentiment: [
        {
            league: "NBA",
            bullish: 0.58,
            bearish: 0.42
        },
        {
            league: "NFL",
            bullish: 0.63,
            bearish: 0.37
        },
        {
            league: "EPL",
            bullish: 0.51,
            bearish: 0.49
        }
    ]
};
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const leaguesParam = searchParams.get("leagues");
    const leagues = leaguesParam ? leaguesParam.split(",").map((league)=>league.trim()).filter(Boolean) : undefined;
    const filteredPlays = leagues ? bestPlays.filter((play)=>leagues.includes(play.league)) : bestPlays;
    return Response.json({
        bestPlays: filteredPlays,
        trends
    });
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__a2be69f5._.js.map