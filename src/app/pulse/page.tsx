
'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  nflFixtures,
  nbaFixtures,
  topOdds,
  smartInsights,
  topHeadlines,
  localWeather,
  gameWeather,
} from '@/lib/pulse-data';
import {
  ArrowRight,
  BarChart,
  BookOpen,
  Bot,
  Flame,
  Globe,
  Newspaper,
  RefreshCw,
  Settings2,
  Sun,
  TrendingUp,
} from 'lucide-react';

export default function PulsePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Pulse Dashboard"
        description="Sports, Odds, News & Weather in one place."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh feed
            </Button>
            <Button variant="secondary">
              <Settings2 className="mr-2 h-4 w-4" />
              Customize sources
            </Button>
            <Button variant="secondary">
              <TrendingUp className="mr-2 h-4 w-4" />
              View trends
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Sports & Fixtures */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame className="h-5 w-5 text-rose-400" />
                Today's Games
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nflFixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {fixture.teams.away} @ {fixture.teams.home}
                    </p>
                    <p className="text-xs text-slate-400">{fixture.time}</p>
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-slate-800">
                    <div
                      className="h-1 rounded-full bg-cyan-400"
                      style={{ width: `${fixture.winProbability}%` }}
                    />
                  </div>
                </div>
              ))}
              {nbaFixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {fixture.teams.away} @ {fixture.teams.home}
                    </p>
                    <p className="text-xs text-slate-400">{fixture.time}</p>
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-slate-800">
                    <div
                      className="h-1 rounded-full bg-indigo-400"
                      style={{ width: `${fixture.winProbability}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center Column: Top Odds & Best Plays */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Top Odds & Value Plays
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topOdds.map((odd) => (
                <div
                  key={odd.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"
                >
                  <p className="text-xs text-slate-400">{odd.league}</p>
                  <p className="text-sm font-medium">{odd.matchup}</p>
                  <div className="mt-2 grid grid-cols-3 text-center text-xs">
                    <div>
                      <p className="text-slate-500">Moneyline</p>
                      <p className="font-semibold text-cyan-300">
                        {odd.moneyline}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">O/U</p>
                      <p className="font-semibold text-cyan-300">
                        {odd.overUnder}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Value</p>
                      <p className="font-semibold text-emerald-300">
                        {odd.valueScore}/10
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="h-5 w-5 text-indigo-400" />
                Smart Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {smartInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"
                >
                  <p className="text-sm font-medium">{insight.play}</p>
                  <p className="text-xs text-slate-400">
                    Confidence: {insight.confidence}%
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: News & Weather */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Newspaper className="h-5 w-5 text-amber-400" />
                Top Headlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topHeadlines.map((headline) => (
                <div key={headline.id} className="text-sm">
                  <p className="font-medium text-slate-200">
                    {headline.title}
                  </p>
                  <p className="text-xs text-slate-400">{headline.source}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sun className="h-5 w-5 text-yellow-400" />
                Weather Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <p className="text-sm font-medium">{localWeather.city}</p>
                <p className="text-2xl font-bold text-white">
                  {localWeather.temp}°C
                </p>
                <p className="text-xs text-slate-400">{localWeather.condition}</p>
              </div>
              {gameWeather.map((weather) => (
                <div key={weather.id} className="text-sm">
                  <p className="font-medium">{weather.city}</p>
                  <p className="text-xs text-slate-400">
                    {weather.temp}°C, {weather.condition}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
