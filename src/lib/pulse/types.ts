export type Game = {
  id: string;
  league: string;
  start: string;
  status: "scheduled" | "live" | "final";
  home: { name: string; code?: string; record?: string };
  away: { name: string; code?: string; record?: string };
  oddsRef?: string;
  venueCity?: string;
  venueCountry?: string;
  live?: { homeScore: number; awayScore: number; period?: string; clock?: string };
  winProb?: number;
  injuries?: string[];
  recentMeetings?: Array<{ when: string; result: string }>;
};

export type OddsRow = {
  id: string;
  gameId: string;
  league: string;
  market: "moneyline" | "spread" | "total";
  selection: string;
  line: number | null;
  price: number;
  books: Array<{ name: string; price: number; line?: number }>;
  marketAvg: number;
  implied: number;
  delta: number;
  valueScore: number;
  sentimentSkew?: number;
  formIndex?: number;
  weatherImpact?: number;
  lineMove?: number;
};

export type Article = {
  id: string;
  source: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  category: "world" | "business" | "tech" | "sports" | "entertainment";
};

export type Forecast = {
  city: string;
  when: string;
  temp: number;
  wind: number;
  rainProb: number;
  note?: string;
  relatedGameIds?: string[];
};

export type Play = {
  id: string;
  gameId: string;
  league: string;
  market: "moneyline" | "spread" | "total";
  pick: string;
  suggested: number | string;
  confidence: number;
  rationale: string[];
  valueScore: number;
  momentum: number;
  sparkline: Array<{ t: string; value: number }>;
};

export type TrendsPayload = {
  lineMoves: Array<{ id: string; t: string; value: number; label?: string }>;
  momentumHeat: Array<{ id: string; label: string; score: number }>;
  sentiment: Array<{ league: string; bullish: number; bearish: number }>;
};

export type Preferences = {
  leagues: string[];
  providers: {
    sports: string[];
    odds: string[];
    news: string[];
    weather: string[];
  };
  units: "metric" | "imperial";
  tz: string;
  alertRules: any[];
};

export type PreferencesUpdate = Partial<Preferences>;

export type WatchlistItem = {
  id: string;
  type: "game" | "play";
  league: string;
  label: string;
  gameId?: string;
  meta?: Record<string, any>;
};
