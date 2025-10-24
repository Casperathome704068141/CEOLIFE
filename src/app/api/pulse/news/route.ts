
import { NextRequest } from "next/server";
import { Article } from "@/lib/pulse/types";

const articles: Article[] = [
  {
    id: "world-1",
    category: "world",
    source: "Reuters",
    title: "Global markets steady amid central bank signals",
    summary: "Investors digest policy hints as inflation cools in several major economies.",
    url: "https://example.com/world-1",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "business-1",
    category: "business",
    source: "AP",
    title: "Manufacturing output climbs on resilient demand",
    summary: "Factory activity posts surprise growth, easing recession fears.",
    url: "https://example.com/business-1",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "tech-1",
    category: "tech",
    source: "Bing News",
    title: "AI startups race to build sports analytics copilots",
    summary: "New entrants tailor machine learning models for front-office decision makers.",
    url: "https://example.com/tech-1",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "sports-1",
    category: "sports",
    source: "Reuters",
    title: "Underdogs shake up conference playoff picture",
    summary: "Two road wins create chaos as postseason seedings come into focus.",
    url: "https://example.com/sports-1",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "entertainment-1",
    category: "entertainment",
    source: "AP",
    title: "Documentary charts rise of data-driven coaching",
    summary: "Streaming release explores how analytics labs shape modern game plans.",
    url: "https://example.com/entertainment-1",
    publishedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") as Article["category"]) ?? "world";
  const filtered = articles.filter((article) => article.category === category);
  return Response.json({ articles: filtered });
}
