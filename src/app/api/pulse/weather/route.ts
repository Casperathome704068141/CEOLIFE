
import { NextRequest } from "next/server";
import { Forecast } from "@/lib/pulse/types";

const forecasts: Forecast[] = [
  {
    city: "Los Angeles",
    when: new Date().toISOString(),
    temp: 72,
    wind: 8,
    rainProb: 0.05,
    note: "Dry marine layer. Pace friendly.",
    relatedGameIds: ["nba-lal-bos"],
  },
  {
    city: "Kansas City",
    when: new Date().toISOString(),
    temp: 48,
    wind: 18,
    rainProb: 0.35,
    note: "Wind ↑: passing efficiency ↓",
    relatedGameIds: ["nfl-kc-buf"],
  },
  {
    city: "London",
    when: new Date().toISOString(),
    temp: 55,
    wind: 12,
    rainProb: 0.4,
    note: "Showers likely. Pitch slows.",
    relatedGameIds: ["epl-ars-che"],
  },
  {
    city: "New York",
    when: new Date().toISOString(),
    temp: 64,
    wind: 10,
    rainProb: 0.2,
    note: "Humid air favors hitters.",
    relatedGameIds: ["mlb-nyy-lad", "nhl-nyr-col"],
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const citiesParam = searchParams.get("cities");
  const cities = citiesParam
    ? citiesParam.split(",").map((city) => city.trim()).filter(Boolean)
    : undefined;
  const filtered = forecasts.filter((forecast) =>
    cities ? cities.includes(forecast.city) : true
  );
  return Response.json({ forecasts: filtered });
}
