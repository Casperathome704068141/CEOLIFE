module.exports = {

"[project]/.next-internal/server/app/api/pulse/weather/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/app/api/pulse/weather/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
const forecasts = [
    {
        city: "Los Angeles",
        when: new Date().toISOString(),
        temp: 72,
        wind: 8,
        rainProb: 0.05,
        note: "Dry marine layer. Pace friendly.",
        relatedGameIds: [
            "nba-lal-bos"
        ]
    },
    {
        city: "Kansas City",
        when: new Date().toISOString(),
        temp: 48,
        wind: 18,
        rainProb: 0.35,
        note: "Wind ↑: passing efficiency ↓",
        relatedGameIds: [
            "nfl-kc-buf"
        ]
    },
    {
        city: "London",
        when: new Date().toISOString(),
        temp: 55,
        wind: 12,
        rainProb: 0.4,
        note: "Showers likely. Pitch slows.",
        relatedGameIds: [
            "epl-ars-che"
        ]
    },
    {
        city: "New York",
        when: new Date().toISOString(),
        temp: 64,
        wind: 10,
        rainProb: 0.2,
        note: "Humid air favors hitters.",
        relatedGameIds: [
            "mlb-nyy-lad",
            "nhl-nyr-col"
        ]
    }
];
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const citiesParam = searchParams.get("cities");
    const cities = citiesParam ? citiesParam.split(",").map((city)=>city.trim()).filter(Boolean) : undefined;
    const filtered = forecasts.filter((forecast)=>cities ? cities.includes(forecast.city) : true);
    return Response.json({
        forecasts: filtered
    });
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__515ae688._.js.map