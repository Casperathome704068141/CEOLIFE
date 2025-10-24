
import { NextRequest } from "next/server";
import { Preferences, PreferencesUpdate } from "@/lib/pulse/types";

let preferencesStore: Preferences = {
  leagues: ["NBA", "NFL", "EPL"],
  providers: {
    sports: ["ESPN", "TheSportsDB"],
    odds: ["TheOddsAPI"],
    news: ["Reuters", "AP"],
    weather: ["OpenWeather"],
  },
  units: "imperial",
  tz: "America/Los_Angeles",
  alertRules: [],
};

export async function GET() {
  return Response.json({ preferences: preferencesStore });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PreferencesUpdate;
  preferencesStore = {
    ...preferencesStore,
    ...body,
    providers: body.providers
      ? {
          sports: body.providers.sports ?? preferencesStore.providers.sports,
          odds: body.providers.odds ?? preferencesStore.providers.odds,
          news: body.providers.news ?? preferencesStore.providers.news,
          weather: body.providers.weather ?? preferencesStore.providers.weather,
        }
      : preferencesStore.providers,
    leagues: body.leagues ?? preferencesStore.leagues,
    units: body.units ?? preferencesStore.units,
    tz: body.tz ?? preferencesStore.tz,
    alertRules: body.alertRules ?? preferencesStore.alertRules,
  };

  return Response.json({ preferences: preferencesStore });
}
