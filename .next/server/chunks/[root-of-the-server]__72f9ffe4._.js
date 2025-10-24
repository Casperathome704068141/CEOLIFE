module.exports = {

"[project]/.next-internal/server/app/api/pulse/news/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/app/api/pulse/news/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
const articles = [
    {
        id: "world-1",
        category: "world",
        source: "Reuters",
        title: "Global markets steady amid central bank signals",
        summary: "Investors digest policy hints as inflation cools in several major economies.",
        url: "https://example.com/world-1",
        publishedAt: new Date().toISOString()
    },
    {
        id: "business-1",
        category: "business",
        source: "AP",
        title: "Manufacturing output climbs on resilient demand",
        summary: "Factory activity posts surprise growth, easing recession fears.",
        url: "https://example.com/business-1",
        publishedAt: new Date().toISOString()
    },
    {
        id: "tech-1",
        category: "tech",
        source: "Bing News",
        title: "AI startups race to build sports analytics copilots",
        summary: "New entrants tailor machine learning models for front-office decision makers.",
        url: "https://example.com/tech-1",
        publishedAt: new Date().toISOString()
    },
    {
        id: "sports-1",
        category: "sports",
        source: "Reuters",
        title: "Underdogs shake up conference playoff picture",
        summary: "Two road wins create chaos as postseason seedings come into focus.",
        url: "https://example.com/sports-1",
        publishedAt: new Date().toISOString()
    },
    {
        id: "entertainment-1",
        category: "entertainment",
        source: "AP",
        title: "Documentary charts rise of data-driven coaching",
        summary: "Streaming release explores how analytics labs shape modern game plans.",
        url: "https://example.com/entertainment-1",
        publishedAt: new Date().toISOString()
    }
];
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? "world";
    const filtered = articles.filter((article)=>article.category === category);
    return Response.json({
        articles: filtered
    });
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__72f9ffe4._.js.map