module.exports = {

"[project]/.next-internal/server/app/api/pulse/preferences/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/app/api/pulse/preferences/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
let preferencesStore = {
    leagues: [
        "NBA",
        "NFL",
        "EPL"
    ],
    providers: {
        sports: [
            "ESPN",
            "TheSportsDB"
        ],
        odds: [
            "TheOddsAPI"
        ],
        news: [
            "Reuters",
            "AP"
        ],
        weather: [
            "OpenWeather"
        ]
    },
    units: "imperial",
    tz: "America/Los_Angeles",
    alertRules: []
};
async function GET() {
    return Response.json({
        preferences: preferencesStore
    });
}
async function POST(request) {
    const body = await request.json();
    preferencesStore = {
        ...preferencesStore,
        ...body,
        providers: body.providers ? {
            sports: body.providers.sports ?? preferencesStore.providers.sports,
            odds: body.providers.odds ?? preferencesStore.providers.odds,
            news: body.providers.news ?? preferencesStore.providers.news,
            weather: body.providers.weather ?? preferencesStore.providers.weather
        } : preferencesStore.providers,
        leagues: body.leagues ?? preferencesStore.leagues,
        units: body.units ?? preferencesStore.units,
        tz: body.tz ?? preferencesStore.tz,
        alertRules: body.alertRules ?? preferencesStore.alertRules
    };
    return Response.json({
        preferences: preferencesStore
    });
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__2edcafbc._.js.map