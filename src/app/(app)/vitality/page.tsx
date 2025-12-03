'use client';

import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlarmClock,
  BellRing,
  CloudSun,
  Flame,
  LayoutGrid,
  Newspaper,
  Radar,
  Sparkle,
  Waves,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

const leagues = ['NFL', 'NBA', 'MLB', 'NHL'];
const horizons = ['Today', '7 Days', '30 Days'];

const schedule = [
  {
    id: 'g1',
    league: 'NFL',
    matchup: 'Eagles @ Cowboys',
    time: '7:30 PM ET',
    venue: 'AT&T Stadium',
    broadcast: 'SNF',
    interest: 92,
    alerts: ['Kickoff', 'Score Change'],
    odds: '+145',
  },
  {
    id: 'g2',
    league: 'NBA',
    matchup: 'Lakers @ Celtics',
    time: '9:05 PM ET',
    venue: 'TD Garden',
    broadcast: 'ESPN',
    interest: 88,
    alerts: ['Tip-off', '4th Quarter'],
    odds: '-120',
  },
  {
    id: 'g3',
    league: 'MLB',
    matchup: 'Dodgers @ Braves',
    time: '4:10 PM ET',
    venue: 'Truist Park',
    broadcast: 'MLBN',
    interest: 81,
    alerts: ['First Pitch', 'Weather'],
    odds: '+110',
  },
];

const news = [
  {
    id: 'n1',
    headline: 'Trade window heats up as contenders add depth',
    league: 'NBA',
    tag: 'Breaking',
    minutesAgo: 14,
  },
  {
    id: 'n2',
    headline: 'Weather could swing tonight’s line in Arlington',
    league: 'NFL',
    tag: 'Weather Edge',
    minutesAgo: 27,
  },
  {
    id: 'n3',
    headline: 'Model loves underdog after overnight odds drift',
    league: 'MLB',
    tag: 'Value Signal',
    minutesAgo: 42,
  },
  {
    id: 'n4',
    headline: 'Two starters questionable – live injury tape rolling',
    league: 'NBA',
    tag: 'Injury',
    minutesAgo: 53,
  },
];

const odds = [
  { id: 'o1', league: 'NFL', market: 'Spread', team: 'Cowboys -3.5', movement: '+0.5', confidence: 78 },
  { id: 'o2', league: 'NFL', market: 'Total', team: 'Over 47.5', movement: '-1.0', confidence: 64 },
  { id: 'o3', league: 'NBA', market: 'Moneyline', team: 'Celtics -120', movement: '-15', confidence: 72 },
  { id: 'o4', league: 'MLB', market: 'Run Line', team: 'Braves -1.5', movement: '+20', confidence: 59 },
];

const weather = [
  { city: 'Arlington, TX', status: 'Storm watch', temp: '78°', impact: 'Wind gusts expected pre-kickoff', severity: 76 },
  { city: 'Boston, MA', status: 'Indoor', temp: '70°', impact: 'No impact (TD Garden)', severity: 5 },
  { city: 'Atlanta, GA', status: 'Humid', temp: '84°', impact: 'Ball is carrying', severity: 33 },
  { city: 'Los Angeles, CA', status: 'Marine layer', temp: '68°', impact: 'Totals lean under', severity: 42 },
];

const watchlist = [
  {
    id: 'w1',
    label: 'Sunday Night Heavyweight',
    detail: 'Cowboys vs. Eagles',
    risk: 'High intensity',
    readiness: 86,
  },
  {
    id: 'w2',
    label: 'Late slate hammer',
    detail: 'Celtics shooting variance',
    risk: 'Moderate',
    readiness: 61,
  },
  {
    id: 'w3',
    label: 'Wind-adjusted under',
    detail: 'Braves total drift',
    risk: 'Edge forming',
    readiness: 74,
  },
];

export default function VitalityPage() {
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [selectedHorizon, setSelectedHorizon] = useState<string>('Today');
  const [alerted, setAlerted] = useState<Record<string, boolean>>({ g1: true, g2: false, g3: true, w1: true, w2: false, w3: true });
  const [timelineHighlight, setTimelineHighlight] = useState<string>('g1');

  const filteredSchedule = useMemo(() => {
    if (selectedLeague === 'ALL') return schedule;
    return schedule.filter((game) => game.league === selectedLeague);
  }, [selectedLeague]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Vitality</p>
          <h1 className="text-3xl font-semibold text-foreground">Your real-time sports nerve center</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            One command deck for news, odds, schedules, weather edges, and proactive alerts. Curate the perfect slate, then let Vitality keep you ahead of the next whistle.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge className="bg-emerald-600/20 text-emerald-200">Live sync</Badge>
            <Badge className="bg-cyan-600/20 text-cyan-100">Cross-sport</Badge>
            <Badge className="bg-amber-500/20 text-amber-100">Alert-ready</Badge>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-3 text-left text-sm lg:w-96">
          <MiniStat label="Games tracked" value="128" trend="+12 today" icon={Radar} />
          <MiniStat label="Active alerts" value="34" trend="6 pending" icon={AlarmClock} />
          <MiniStat label="Edges found" value="19" trend="8 weather" icon={Flame} />
          <MiniStat label="Stories curated" value="52" trend="Auto-refreshed" icon={Newspaper} />
        </div>
      </header>

      <Tabs defaultValue="signal" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="signal" className="gap-2"><LayoutGrid size={16} /> Signal board</TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2"><AlarmClock size={16} /> Game planner</TabsTrigger>
          <TabsTrigger value="news" className="gap-2"><Newspaper size={16} /> News desk</TabsTrigger>
          <TabsTrigger value="weather" className="gap-2"><CloudSun size={16} /> Weather edge</TabsTrigger>
        </TabsList>

        <TabsContent value="signal" className="space-y-4">
          <Card className="border border-border/70 bg-background/70">
            <CardHeader className="flex flex-col gap-4 border-b border-border/70 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold"><Activity className="h-5 w-5 text-emerald-300" /> Live signal board</CardTitle>
                <CardDescription>Blend odds drift, model confidence, and weather context in one glance.</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <LeaguePills selected={selectedLeague} onSelect={setSelectedLeague} />
                <Separator orientation="vertical" className="hidden h-6 sm:block" />
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1">
                  <span className="text-muted-foreground">Horizon</span>
                  <div className="flex items-center gap-1">
                    {horizons.map((h) => (
                      <Button
                        key={h}
                        size="sm"
                        variant={selectedHorizon === h ? 'default' : 'ghost'}
                        className={`h-8 px-3 text-xs ${selectedHorizon === h ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                        onClick={() => setSelectedHorizon(h)}
                      >
                        {h}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <SignalTable odds={odds} />
              <Card className="border border-emerald-900/40 bg-emerald-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-emerald-100"><Sparkle className="h-4 w-4" /> Prime Watchlist</CardTitle>
                  <CardDescription>Upgrade any game to a proactive alerting channel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {watchlist.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-emerald-900/40 bg-emerald-900/10 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.detail}</p>
                        </div>
                        <Switch checked={alerted[item.id]} onCheckedChange={(val) => setAlerted((prev) => ({ ...prev, [item.id]: val }))} />
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-emerald-100">
                        <Badge className="bg-emerald-500/20 text-emerald-100">{item.risk}</Badge>
                        <div className="flex flex-1 items-center gap-2">
                          <span>Readiness</span>
                          <Progress value={item.readiness} className="h-2 flex-1" />
                          <span className="text-foreground">{item.readiness}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-dashed border-emerald-800/50 bg-emerald-900/10 text-emerald-100 hover:border-emerald-700">
                    <BellRing className="mr-2 h-4 w-4" /> Create alert recipe
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="border border-border/70 bg-background/70">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold"><AlarmClock className="h-5 w-5 text-amber-300" /> Game planner</CardTitle>
                <CardDescription>Reorder your night and attach alerts directly from the slate.</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-50">Auto-sync calendar</Badge>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-50">Alert stack ready</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-3">
                {filteredSchedule.map((game) => (
                  <div
                    key={game.id}
                    className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl ${timelineHighlight === game.id ? 'border-primary/60 bg-primary/5' : 'border-border/60 bg-background/50'}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          <span>{game.league}</span>
                          <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] text-foreground">{selectedHorizon}</span>
                          <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[11px] text-cyan-100">{game.broadcast}</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground">{game.matchup}</p>
                        <p className="text-xs text-muted-foreground">{game.venue} · {game.time}</p>
                        <div className="flex flex-wrap gap-2 text-[11px] text-emerald-100">
                          {game.alerts.map((a) => (
                            <Badge key={a} className="bg-emerald-500/20 text-emerald-100">{a}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-200">Edge {game.interest}%</span>
                          <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs text-amber-100">{game.odds}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={!!alerted[game.id]}
                            onCheckedChange={(val) => setAlerted((prev) => ({ ...prev, [game.id]: val }))}
                            id={`switch-${game.id}`}
                          />
                          <label htmlFor={`switch-${game.id}`} className="text-xs text-muted-foreground">Alerts {alerted[game.id] ? 'on' : 'off'}</label>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" className="bg-primary/10 text-primary" onClick={() => setTimelineHighlight(game.id)}>
                            Pin timeline
                          </Button>
                          <Button size="sm" variant="outline" className="border-dashed">Add to calendar</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Card className="border border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-primary"><Waves className="h-4 w-4" /> Timeline pulse</CardTitle>
                  <CardDescription>Auto-assembled timeline: combines alerts, weather, and odds moves.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[420px] pr-4">
                    <div className="space-y-4 text-sm">
                      {filteredSchedule.map((game) => (
                        <div key={`timeline-${game.id}`} className={`rounded-xl border p-3 ${timelineHighlight === game.id ? 'border-primary/60 bg-primary/10' : 'border-border/50 bg-background/40'}`}>
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{game.league}</p>
                              <p className="font-semibold text-foreground">{game.matchup}</p>
                            </div>
                            <Badge className="bg-slate-800 text-slate-100">{game.time}</Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="rounded-lg border border-border/50 bg-background/60 p-2">Odds: {game.odds}</div>
                            <div className="rounded-lg border border-border/50 bg-background/60 p-2">Interest: {game.interest}%</div>
                            <div className="rounded-lg border border-border/50 bg-background/60 p-2">Venue: {game.venue}</div>
                            <div className="rounded-lg border border-border/50 bg-background/60 p-2">Alerts: {game.alerts.join(', ')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <Card className="border border-border/70 bg-background/70">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold"><Newspaper className="h-5 w-5 text-cyan-200" /> Live newsroom</CardTitle>
                <CardDescription>Cross-league digest, ranked by freshness and relevance.</CardDescription>
              </div>
              <Button variant="secondary" className="bg-cyan-500/15 text-cyan-100">
                <Sparkle className="mr-2 h-4 w-4" /> Personalize sources
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-3">
                {news.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        <span>{item.league}</span>
                        <Badge className="bg-cyan-500/15 text-cyan-100">{item.tag}</Badge>
                        <span className="text-muted-foreground">{item.minutesAgo}m ago</span>
                      </div>
                      <p className="text-base font-semibold text-foreground">{item.headline}</p>
                      <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        <Badge variant="outline" className="border-dashed">Add to Brief</Badge>
                        <Badge variant="outline" className="border-dashed">Watch injury room</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Subscribe
                    </Button>
                  </div>
                ))}
              </div>
              <Card className="border border-cyan-900/40 bg-cyan-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-cyan-100"><Newspaper className="h-4 w-4" /> Spotlight playlist</CardTitle>
                  <CardDescription>Pin leagues for a curated briefing and auto alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {leagues.map((lg) => (
                      <Button key={lg} variant={selectedLeague === lg ? 'default' : 'outline'} className="justify-start" onClick={() => setSelectedLeague(lg)}>
                        {lg}
                      </Button>
                    ))}
                    <Button variant={selectedLeague === 'ALL' ? 'default' : 'outline'} className="col-span-2 justify-start" onClick={() => setSelectedLeague('ALL')}>
                      All leagues
                    </Button>
                  </div>
                  <Separator className="bg-cyan-900/40" />
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p className="text-sm font-semibold text-cyan-50">Automation stack</p>
                    <ul className="space-y-2">
                      <li className="rounded-lg border border-cyan-900/50 bg-cyan-900/10 p-2">Trigger alerts when odds move ±15 bps</li>
                      <li className="rounded-lg border border-cyan-900/50 bg-cyan-900/10 p-2">Send injury desk updates to mobile + email</li>
                      <li className="rounded-lg border border-cyan-900/50 bg-cyan-900/10 p-2">Auto-enrich weather notes into schedule</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <Card className="border border-border/70 bg-background/70">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold"><CloudSun className="h-5 w-5 text-sky-200" /> Weather edge grid</CardTitle>
                <CardDescription>Merged radar + venue context so you can adjust your angles.</CardDescription>
              </div>
              <Button variant="outline" className="border-sky-500/40 text-sky-100">
                <Flame className="mr-2 h-4 w-4" /> Heatmap overlay
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="grid gap-3 md:grid-cols-2">
                {weather.map((w) => (
                  <div key={w.city} className="rounded-2xl border border-sky-900/40 bg-sky-900/10 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-sky-100">{w.city}</p>
                        <p className="text-sm font-semibold text-foreground">{w.status}</p>
                        <p className="text-xs text-muted-foreground">{w.impact}</p>
                      </div>
                      <span className="text-lg font-bold text-sky-100">{w.temp}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-sky-100">
                      <Progress value={w.severity} className="h-2 flex-1" />
                      <span>{w.severity}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <Card className="border border-slate-800 bg-slate-900/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-sky-100"><Waves className="h-4 w-4" /> Weather-linked planner</CardTitle>
                  <CardDescription>Align schedule and odds to weather confidence.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="text-foreground">Vitality pairs forecasts with odds so you know when to move.</p>
                  <ul className="space-y-2">
                    <li className="rounded-xl border border-slate-800/60 bg-slate-900/80 p-3">Auto-tag games impacted by precipitation or wind.</li>
                    <li className="rounded-xl border border-slate-800/60 bg-slate-900/80 p-3">Push alerts when severity crosses your threshold.</li>
                    <li className="rounded-xl border border-slate-800/60 bg-slate-900/80 p-3">Sync notes to planner so your calendar stays weather-aware.</li>
                  </ul>
                  <Button variant="secondary" className="w-full bg-sky-500/15 text-sky-100">
                    Link weather to alerts
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MiniStat({ label, value, trend, icon: Icon }: { label: string; value: string; trend: string; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="uppercase tracking-[0.25em]">{label}</span>
      </div>
      <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-emerald-300">{trend}</p>
    </div>
  );
}

function LeaguePills({ selected, onSelect }: { selected: string; onSelect: (league: string) => void }) {
  const pills = ['ALL', ...leagues];
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill) => (
        <button
          key={pill}
          onClick={() => onSelect(pill)}
          className={`rounded-full border px-3 py-1 text-xs transition ${selected === pill ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary'}`}
        >
          {pill}
        </button>
      ))}
    </div>
  );
}

function SignalTable({ odds }: { odds: typeof odds }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <TableHead>League</TableHead>
          <TableHead>Market</TableHead>
          <TableHead>Focus</TableHead>
          <TableHead>Movement</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {odds.map((row) => (
          <TableRow key={row.id} className="border-border/60">
            <TableCell className="text-xs font-medium text-foreground">{row.league}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{row.market}</TableCell>
            <TableCell className="text-sm font-semibold text-foreground">{row.team}</TableCell>
            <TableCell className="text-xs text-amber-100">{row.movement}</TableCell>
            <TableCell className="w-48">
              <div className="flex items-center gap-2">
                <Progress value={row.confidence} className="h-2 flex-1" />
                <span className="text-xs text-foreground">{row.confidence}%</span>
              </div>
            </TableCell>
            <TableCell className="text-right text-xs">
              <Button size="sm" variant="ghost" className="text-primary">
                Track
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
