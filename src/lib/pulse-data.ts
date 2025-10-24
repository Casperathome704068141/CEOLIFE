
export const nflFixtures = [
  {
    id: "nfl-1",
    teams: { home: "Eagles", away: "Chiefs" },
    time: "1:00 PM",
    winProbability: 55,
  },
  {
    id: "nfl-2",
    teams: { home: "Cowboys", away: "49ers" },
    time: "4:30 PM",
    winProbability: 48,
  },
];

export const nbaFixtures = [
  {
    id: "nba-1",
    teams: { home: "Lakers", away: "Celtics" },
    time: "7:00 PM",
    winProbability: 62,
  },
];

export const topOdds = [
  {
    id: "odds-1",
    league: "NFL",
    matchup: "Eagles vs Chiefs",
    moneyline: "+210",
    overUnder: 48.5,
    valueScore: 8.7,
  },
  {
    id: "odds-2",
    league: "NBA",
    matchup: "Lakers vs Celtics",
    moneyline: "-150",
    overUnder: 220.5,
    valueScore: 7.2,
  },
];

export const smartInsights = [
  { id: "si-1", play: "Celtics (-3.5)", confidence: 73 },
  { id: "si-2", play: "Inter Milan to win", confidence: 68 },
  { id: "si-3", play: "Cowboys Over 43.5", confidence: 65 },
];

export const topHeadlines = [
  {
    id: "news-1",
    title: "Market sentiment cautious as oil prices climb",
    source: "Reuters",
  },
  {
    id: "news-2",
    title: "Tech stocks rally on positive inflation data",
    source: "Bloomberg",
  },
  {
    id: "news-3",
    title: "EPL: Arsenal secures late winner against Chelsea",
    source: "ESPN",
  },
];

export const localWeather = {
  city: "Toronto, ON",
  temp: 18,
  condition: "Partly Cloudy",
};

export const gameWeather = [
  {
    id: "gw-1",
    city: "Wembley, London",
    match: "Arsenal vs Chelsea",
    temp: 15,
    condition: "Ideal for Over 2.5",
  },
  {
    id: "gw-2",
    city: "Philadelphia, PA",
    match: "Eagles vs Chiefs",
    temp: 22,
    condition: "Clear skies",
  },
];
