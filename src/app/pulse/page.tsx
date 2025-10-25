
"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { formatISO, addDays, startOfDay } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HeaderBar } from "@/components/pulse/HeaderBar";
import { LeagueFilter } from "@/components/pulse/LeagueFilter";
import { WatchlistBar } from "@/components/pulse/WatchlistBar";
import { Bento } from "@/components/pulse/Bento";
import { ScheduleCard } from "@/components/pulse/cards/ScheduleCard";
import { LiveScoreCard } from "@/components/pulse/cards/LiveScoreCard";
import { OddsValueCard } from "@/components/pulse/cards/OddsValueCard";
import { BestPlaysCard } from "@/components/pulse/cards/BestPlaysCard";
import { NewsCard } from "@/components/pulse/cards/NewsCard";
import { WeatherCard } from "@/components/pulse/cards/WeatherCard";
import { TrendsCard } from "@/components/pulse/cards/TrendsCard";
import { DisclaimerCard } from "@/components/pulse/cards/DisclaimerCard";
import { CustomizeSourcesDialog } from "@/components/pulse/modals/CustomizeSourcesDialog";
import { ExplainValueDialog } from "@/components/pulse/modals/ExplainValueDialog";
import { AlertRuleDialog } from "@/components/pulse/modals/AlertRuleDialog";
import { usePreferences } from "@/lib/pulse/usePreferences";
import { useWatchlist } from "@/lib/pulse/useWatchlist";
import { Forecast, Game, OddsRow, Play, Preferences, TrendsPayload } from "@/lib/pulse/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

function useDateRange(dateRange: ReturnType<typeof usePreferences>["dateRange"]) {
  return useMemo(() => {
    const today = startOfDay(new Date());
    const from = formatISO(today, { representation: "date" });
    const to = formatISO(addDays(today, dateRange === "today" ? 0 : dateRange === "7d" ? 7 : 30), {
      representation: "date",
    });
    return { from, to };
  }, [dateRange]);
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return (await response.json()) as T;
}

type PreferencesResponse = { preferences: Preferences };
type SportsResponse = { games: Game[] };
type OddsResponse = { odds: OddsRow[] };
type WeatherResponse = { forecasts: Forecast[] };
type InsightsResponse = { bestPlays: Play[]; trends: TrendsPayload };

export default function PulsePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    selectedLeagues,
    dateRange,
    onlyWatchlist,
    setOnlyWatchlist,
    setSavedPreferences,
    saved,
  } = usePreferences();
  const { ids: watchlistIds, add, remove } = useWatchlist();

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [explainRow, setExplainRow] = useState<OddsRow | undefined>();
  const [alertContext, setAlertContext] = useState<{ id: string; label: string; league: string } | undefined>();
  const [focusedWatchId, setFocusedWatchId] = useState<string | null>(null);

  const leagueFilterRef = useRef<HTMLDivElement>(null);
  const trendsRef = useRef<HTMLDivElement>(null);

  const { from, to } = useDateRange(dateRange);

  useQuery({
    queryKey: ["pulse", "preferences"],
    queryFn: () => fetchJSON<PreferencesResponse>("/api/pulse/preferences"),
    staleTime: 1000 * 60 * 5,
    onSuccess: (data) => {
      setSavedPreferences(data.preferences);
    },
  });

  const sportsQuery = useQuery({
    queryKey: ["pulse", "sports", selectedLeagues.slice().sort().join("-"), from, to],
    queryFn: () =>
      fetchJSON<SportsResponse>(
        `/api/pulse/sports?leagues=${encodeURIComponent(selectedLeagues.join(","))}&from=${from}&to=${to}`
      ),
    select: (result) => result.games,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });

  const oddsQuery = useQuery({
    queryKey: ["pulse", "odds", selectedLeagues.slice().sort().join("-")],
    queryFn: () => fetchJSON<OddsResponse>(`/api/pulse/odds?leagues=${encodeURIComponent(selectedLeagues.join(","))}`),
    select: (result) => result.odds,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });

  const insightsQuery = useQuery({
    queryKey: ["pulse", "insights", selectedLeagues.slice().sort().join("-")],
    queryFn: () => fetchJSON<InsightsResponse>(`/api/pulse/insights?leagues=${encodeURIComponent(selectedLeagues.join(","))}`),
    staleTime: 1000 * 60,
  });

  const cities = useMemo(() => {
    const data = sportsQuery.data ?? [];
    const unique = new Set<string>();
    data.forEach((game) => {
      if (game.venueCity) {
        unique.add(game.venueCity);
      }
    });
    return Array.from(unique);
  }, [sportsQuery.data]);

  const weatherQuery = useQuery({
    queryKey: ["pulse", "weather", cities.slice().sort().join(",")],
    queryFn: () =>
      fetchJSON<WeatherResponse>(`/api/pulse/weather?cities=${cities.map((city) => encodeURIComponent(city)).join(",")}`),
    select: (result) => result.forecasts,
    enabled: cities.length > 0,
    staleTime: 1000 * 60 * 30,
  });

  const games = sportsQuery.data ?? [];
  const odds = oddsQuery.data ?? [];
  const bestPlays = insightsQuery.data?.bestPlays ?? [];
  const trends = insightsQuery.data?.trends ?? { lineMoves: [], momentumHeat: [], sentiment: [] };
  const forecasts = weatherQuery.data ?? [];

  const filteredOdds = onlyWatchlist
    ? odds.filter((row) => watchlistIds.has(row.id) || watchlistIds.has(row.gameId))
    : odds;
  const filteredPlays = onlyWatchlist ? bestPlays.filter((play) => watchlistIds.has(play.id)) : bestPlays;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["pulse"] });
    toast({ title: "Refreshing", description: "Pulse data refreshing in the background." });
  };

  const handleAddToBrief = async (payload: { title: string; body: string }) => {
    await fetch("/api/assistant/actions/nudge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: payload.title, summary: payload.body }),
    });
    toast({ title: "Sent to Beno", description: `${payload.title} queued for your assistant.` });
  };

  const handleCustomizeSave = async (update: Partial<Preferences>) => {
    const response = await fetch("/api/pulse/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    const data = (await response.json()) as PreferencesResponse;
    setSavedPreferences(data.preferences);
    queryClient.invalidateQueries({ queryKey: ["pulse", "preferences"] });
    queryClient.invalidateQueries({ queryKey: ["pulse", "sports"] });
    queryClient.invalidateQueries({ queryKey: ["pulse", "odds"] });
  };

  const handleAlertSave = async (draft: any) => {
    const existing = saved?.alertRules ?? [];
    const response = await fetch("/api/pulse/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertRules: [...existing, { ...draft, context: alertContext }] }),
    });
    const data = (await response.json()) as PreferencesResponse;
    setSavedPreferences(data.preferences);
    queryClient.invalidateQueries({ queryKey: ["pulse", "preferences"] });
    toast({ title: "Alert saved", description: "We'll notify you when this rule is triggered." });
  };

  const handleTrackGame = (game: Game) => {
    add({
      id: game.id,
      type: "game",
      league: game.league,
      label: `${game.away.name} @ ${game.home.name}`,
      gameId: game.id,
      meta: { start: game.start },
    });
    toast({ title: "Game tracked", description: `${game.away.name} @ ${game.home.name} added to watchlist.` });
  };

  const handleUntrackGame = (game: Game) => {
    remove({ id: game.id, type: "game", league: game.league, label: `${game.away.name} @ ${game.home.name}`, gameId: game.id });
    toast({ title: "Removed", description: `${game.away.name} @ ${game.home.name} removed from watchlist.` });
  };

  const handleTrackPlay = (play: Play) => {
    add({
      id: play.id,
      type: "play",
      league: play.league,
      label: play.pick,
      gameId: play.gameId,
      meta: { market: play.market },
    });
    toast({ title: "Play tracked", description: `${play.pick} pinned to your watchlist.` });
  };

  const handleTrackOdds = (row: OddsRow) => {
    add({ id: row.id, type: "play", league: row.league, label: row.selection, gameId: row.gameId });
    toast({ title: "Edge tracked", description: `${row.selection} saved to your watchlist.` });
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target && ["input", "textarea"].includes(target.tagName.toLowerCase())) return;
      switch (event.key.toLowerCase()) {
        case "r":
          event.preventDefault();
          handleRefresh();
          break;
        case "f":
          leagueFilterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          (leagueFilterRef.current?.querySelector("button") as HTMLButtonElement | null)?.focus();
          break;
        case "w":
          event.preventDefault();
          setOnlyWatchlist(!onlyWatchlist);
          break;
        case "t":
          event.preventDefault();
          trendsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyWatchlist, setOnlyWatchlist]);

  return (
    <div className="space-y-6">
      <HeaderBar
        onRefresh={handleRefresh}
        onCustomize={() => setCustomizeOpen(true)}
        onViewTrends={() => trendsRef.current?.scrollIntoView({ behavior: "smooth" })}
      />
      <div ref={leagueFilterRef} className="space-y-4">
        <LeagueFilter />
        <WatchlistBar
          onSelect={(id) => {
            setFocusedWatchId(id);
            setOnlyWatchlist(true);
          }}
        />
      </div>
      <Bento>
        <div className="flex flex-col gap-6">
          {sportsQuery.isLoading ? (
            <Skeleton className="h-96 w-full rounded-2xl" />
          ) : (
            <ScheduleCard
              games={games}
              trackedIds={watchlistIds}
              onTrack={handleTrackGame}
              onUntrack={handleUntrackGame}
              onlyWatchlist={onlyWatchlist}
              onAddToBrief={handleAddToBrief}
              focusedId={focusedWatchId}
            />
          )}
          <LiveScoreCard games={games} onAddToBrief={handleAddToBrief} />
        </div>
        <div className="flex flex-col gap-6">
          {oddsQuery.isLoading ? (
            <Skeleton className="h-80 w-full rounded-2xl" />
          ) : (
            <OddsValueCard
              rows={filteredOdds}
              onExplain={setExplainRow}
              onTrack={handleTrackOdds}
              onAlert={(row) => setAlertContext({ id: row.id, label: row.selection, league: row.league })}
              onAddToBrief={handleAddToBrief}
            />
          )}
          <BestPlaysCard
            plays={filteredPlays}
            onAlert={(play) => setAlertContext({ id: play.id, label: play.pick, league: play.league })}
            onTrack={handleTrackPlay}
            trackedIds={watchlistIds}
            onAddToBrief={handleAddToBrief}
          />
        </div>
        <div className="flex flex-col gap-6">
          <NewsCard onAddToBrief={handleAddToBrief} />
          <WeatherCard forecasts={forecasts} games={games} onAddToBrief={handleAddToBrief} />
          <DisclaimerCard />
        </div>
      </Bento>
      <div ref={trendsRef}>
        <TrendsCard trends={trends} onAddToBrief={handleAddToBrief} />
      </div>
      <CustomizeSourcesDialog
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        preferences={saved}
        onSave={handleCustomizeSave}
      />
      <ExplainValueDialog
        row={explainRow}
        open={!!explainRow}
        onOpenChange={(open) => !open && setExplainRow(undefined)}
      />
      <AlertRuleDialog
        open={!!alertContext}
        onOpenChange={(open) => {
          if (!open) setAlertContext(undefined);
        }}
        context={alertContext}
        onSave={handleAlertSave}
      />
    </div>
  );
}
