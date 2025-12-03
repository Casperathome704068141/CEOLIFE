'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Bento } from '@/components/pulse/Bento';
import { HeaderBar } from '@/components/pulse/HeaderBar';
import { LeagueFilter } from '@/components/pulse/LeagueFilter';
import { WatchlistBar } from '@/components/pulse/WatchlistBar';
import { DisclaimerCard } from '@/components/pulse/cards/DisclaimerCard';
import { AlertRuleDialog } from '@/components/pulse/modals/AlertRuleDialog';
import { CustomizeSourcesDialog } from '@/components/pulse/modals/CustomizeSourcesDialog';
import { ExplainValueDialog } from '@/components/pulse/modals/ExplainValueDialog';
import { usePreferences } from '@/lib/pulse/usePreferences';
import { useWatchlist } from '@/lib/pulse/useWatchlist';
import type { Game, OddsRow, Play, Preferences } from '@/lib/pulse/types';
import { useToast } from '@/hooks/use-toast';
import { addDays, startOfDay, formatISO } from 'date-fns';

const BestPlaysCard = dynamic(() => import('@/components/pulse/cards/BestPlaysCard').then((m) => m.BestPlaysCard), {
  loading: () => <PulseSkeleton label="Plays" />,
});
const LiveScoreCard = dynamic(() => import('@/components/pulse/cards/LiveScoreCard').then((m) => m.LiveScoreCard), {
  loading: () => <PulseSkeleton label="Live Scores" />,
});
const NewsCard = dynamic(() => import('@/components/pulse/cards/NewsCard').then((m) => m.NewsCard), {
  loading: () => <PulseSkeleton label="News" />,
});
const OddsValueCard = dynamic(() => import('@/components/pulse/cards/OddsValueCard').then((m) => m.OddsValueCard), {
  loading: () => <PulseSkeleton label="Value" />,
});
const ScheduleCard = dynamic(() => import('@/components/pulse/cards/ScheduleCard').then((m) => m.ScheduleCard), {
  loading: () => <PulseSkeleton label="Schedule" />,
});
const WeatherCard = dynamic(() => import('@/components/pulse/cards/WeatherCard').then((m) => m.WeatherCard), {
  loading: () => <PulseSkeleton label="Weather" />,
});
const TrendsCard = dynamic(() => import('@/components/pulse/cards/TrendsCard').then((m) => m.TrendsCard), {
  loading: () => <PulseSkeleton label="Trends" fullWidth />,
});

export default function PulsePage() {
  const { toast } = useToast();
  const { selectedLeagues, dateRange, onlyWatchlist } = usePreferences();
  const { items: watchlist, ids: watchlistIds, add: addToWatchlist } = useWatchlist();

  const [dialog, setDialog] = useState<string | null>(null);
  const [alertContext, setAlertContext] = useState<any>(null);
  const [explainContext, setExplainContext] = useState<any>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const dateFilters = {
    today: { from: startOfDay(new Date()), to: startOfDay(new Date()) },
    '7d': { from: startOfDay(new Date()), to: addDays(new Date(), 7) },
    '30d': { from: startOfDay(new Date()), to: addDays(new Date(), 30) },
  };
  const { from, to } = dateFilters[dateRange];

  const leagues = selectedLeagues.join(',');
  const gamesQuery = useQuery<{ games: Game[] }>({
    queryKey: ['pulse', 'games', leagues, dateRange],
    queryFn: () => fetch(`/api/pulse/sports?leagues=${leagues}&from=${formatISO(from)}&to=${formatISO(to)}`).then((res) => res.json()),
    staleTime: 60_000,
    retry: 1,
    onError: () => toast({ title: 'Network jitter', description: 'Sports feed unstable. Retrying...', variant: 'destructive' }),
  });
  const oddsQuery = useQuery<{ odds: OddsRow[] }>({
    queryKey: ['pulse', 'odds', leagues],
    queryFn: () => fetch(`/api/pulse/odds?leagues=${leagues}`).then((res) => res.json()),
    staleTime: 120_000,
    retry: 1,
    onError: () => toast({ title: 'Network jitter', description: 'Odds desk unreachable', variant: 'destructive' }),
  });
  const insightsQuery = useQuery<{ bestPlays: Play[], trends: any }>({
    queryKey: ['pulse', 'insights', leagues],
    queryFn: () => fetch(`/api/pulse/insights?leagues=${leagues}`).then((res) => res.json()),
    staleTime: 120_000,
    retry: 1,
    onError: () => toast({ title: 'Signal degraded', description: 'Insights temporarily offline', variant: 'destructive' }),
  });
  const weatherQuery = useQuery<{ forecasts: any[] }>({
    queryKey: ['pulse', 'weather', leagues],
    queryFn: () => {
      const cities = Array.from(new Set(gamesQuery.data?.games.map((g) => g.venueCity).filter(Boolean)));
      return fetch(`/api/pulse/weather?cities=${cities.join(',')}`).then((res) => res.json());
    },
    enabled: !!gamesQuery.data?.games.length,
  });
  const prefsQuery = useQuery<Preferences>({
    queryKey: ['pulse', 'preferences'],
    queryFn: () => fetch('/api/pulse/preferences').then((res) => res.json()),
  });

  const games = onlyWatchlist ? gamesQuery.data?.games.filter((g) => watchlistIds.has(g.id)) : gamesQuery.data?.games;
  const isLoading = gamesQuery.isLoading || oddsQuery.isLoading || insightsQuery.isLoading;
  const hasError = gamesQuery.isError || oddsQuery.isError || insightsQuery.isError;

  const handleAddToBrief = async (payload: { title: string; body: string }) => {
    toast({ title: 'Added to Briefing', description: payload.title });
  };

  return (
    <div className="space-y-6">
      <HeaderBar
        onRefresh={() => {
          Promise.allSettled([gamesQuery.refetch(), oddsQuery.refetch(), insightsQuery.refetch()]).then((results) => {
            const hadError = results.some((res) => res.status === 'rejected');
            if (hadError) {
              toast({ title: 'Network jitter', description: 'Some feeds failed to refresh.' });
            }
          });
        }}
        onCustomize={() => setDialog('customize')}
        onViewTrends={() => setDialog('trends')}
      />
      <WatchlistBar onSelect={(id) => setFocusedId(id)} />
      <LeagueFilter />
      <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/70 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Unified Life Score aware</p>
          <span className="rounded-full border border-border/70 px-2 py-1 text-[10px] uppercase">Cashflow + Pulse synced</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/70 px-3 py-2 text-xs">
          <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-200">{watchlistIds.size} tracked</span>
          <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-cyan-100">{selectedLeagues.length} leagues</span>
          <span className="rounded-full bg-amber-500/20 px-2 py-1 text-amber-100">{dateRange} horizon</span>
        </div>
        <div className="flex items-center justify-end gap-2 text-xs">
          {hasError ? <span className="text-amber-300">Network jitter - retrying…</span> : <span className="text-emerald-200">Signals live refreshed</span>}
        </div>
      </div>
      <Bento>
        <div className="col-span-1 space-y-8 lg:col-span-2">
          {isLoading ? (
            <PulseSkeleton label="Schedule" />
          ) : (
            <>
              <ScheduleCard
                games={games ?? []}
                trackedIds={watchlistIds}
                onTrack={(game) => addToWatchlist({ id: game.id, type: 'game', league: game.league, label: `${game.away.name} @ ${game.home.name}` })}
                onUntrack={(game) => {}}
                onlyWatchlist={onlyWatchlist}
                onAddToBrief={handleAddToBrief}
                focusedId={focusedId}
              />
              <OddsValueCard
                rows={oddsQuery.data?.odds ?? []}
                onExplain={(row) => setExplainContext(row)}
                onTrack={(row) => addToWatchlist({ id: row.gameId, type: 'game', league: row.league, label: row.selection })}
                onAlert={(row) => setAlertContext({ id: row.id, label: row.selection, league: row.league })}
                onAddToBrief={handleAddToBrief}
              />
            </>
          )}
        </div>
        <div className="col-span-1 space-y-8">
          <BestPlaysCard
            plays={insightsQuery.data?.bestPlays ?? []}
            onAlert={(play) => setAlertContext({ id: play.id, label: play.pick, league: play.league })}
            onTrack={(play) => addToWatchlist({ id: play.id, type: 'play', league: play.league, label: play.pick })}
            trackedIds={watchlistIds}
            onAddToBrief={handleAddToBrief}
          />
          <LiveScoreCard games={games ?? []} onAddToBrief={handleAddToBrief} />
          <NewsCard onAddToBrief={handleAddToBrief} />
          <WeatherCard forecasts={weatherQuery.data?.forecasts ?? []} games={games ?? []} onAddToBrief={handleAddToBrief} />
          <DisclaimerCard />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <TrendsCard trends={insightsQuery.data?.trends ?? { lineMoves: [], momentumHeat: [], sentiment: [] }} onAddToBrief={handleAddToBrief} />
        </div>
      </Bento>

      {!hasError && !isLoading && games?.length === 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <span>No fixtures match the current filters. Adjust leagues or date range.</span>
          <button
            className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100"
            onClick={() => setDialog('customize')}
          >
            Tune Filters
          </button>
        </div>
      )}

      <AlertRuleDialog
        open={dialog === 'alert'}
        onOpenChange={() => setDialog(null)}
        context={alertContext}
        onSave={() => {}}
      />
      <CustomizeSourcesDialog
        open={dialog === 'customize'}
        onOpenChange={() => setDialog(null)}
        preferences={prefsQuery.data}
        onSave={() => {}}
      />
      <ExplainValueDialog
        open={!!explainContext}
        onOpenChange={() => setExplainContext(null)}
        row={explainContext}
      />
    </div>
  );
}

function PulseSkeleton({ label, fullWidth }: { label: string; fullWidth?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-slate-900/60 bg-slate-900/40 p-6 text-sm text-slate-500 shadow-[0_10px_50px_rgba(0,0,0,0.35)] ${
        fullWidth ? 'col-span-full' : ''
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">{label}</span>
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.6)]" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-700/60" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-800" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-800" />
      </div>
    </div>
  );
}
