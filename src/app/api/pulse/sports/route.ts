
import { addDays, addHours, formatISO, isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import { NextRequest } from "next/server";
import { Game } from "@/lib/pulse/types";

const now = new Date();

function createGame(partial: Partial<Game> & { id: string; league: string }) {
  const baseStart = partial.start ? parseISO(partial.start) : addHours(startOfDay(now), 8);
  const start = formatISO(baseStart);
  return {
    oddsRef: `${partial.id}-odds`,
    venueCountry: "USA",
    winProb: 0.52,
    injuries: ["Day-to-day: Star PG (ankle)", "Questionable: Forward (illness)"],
    recentMeetings: [
      { when: "2024-11-02", result: "HOME 112 - 108" },
      { when: "2024-04-22", result: "AWAY 97 - 101" },
    ],
    ...partial,
    start,
  } as Game;
}

const games: Game[] = [
  createGame({
    id: "nba-lal-bos",
    league: "NBA",
    start: formatISO(addHours(startOfDay(now), 19)),
    status: "scheduled",
    home: { name: "Los Angeles Lakers", code: "LAL", record: "12-6" },
    away: { name: "Boston Celtics", code: "BOS", record: "13-5" },
    venueCity: "Los Angeles",
    winProb: 0.58,
  }),
  createGame({
    id: "nba-nyk-mia",
    league: "NBA",
    start: formatISO(addHours(startOfDay(addDays(now, 1)), 19)),
    status: "scheduled",
    home: { name: "New York Knicks", code: "NYK", record: "11-8" },
    away: { name: "Miami Heat", code: "MIA", record: "10-9" },
    venueCity: "New York",
    winProb: 0.51,
  }),
  createGame({
    id: "nfl-kc-buf",
    league: "NFL",
    start: formatISO(addHours(startOfDay(addDays(now, 0)), 16)),
    status: "live",
    home: { name: "Kansas City Chiefs", code: "KC", record: "7-2" },
    away: { name: "Buffalo Bills", code: "BUF", record: "6-3" },
    venueCity: "Kansas City",
    live: { homeScore: 24, awayScore: 20, period: "Q4", clock: "08:32" },
    winProb: 0.62,
  }),
  createGame({
    id: "epl-ars-che",
    league: "EPL",
    start: formatISO(addHours(addDays(startOfDay(now), 2), 15)),
    status: "scheduled",
    home: { name: "Arsenal", code: "ARS", record: "8-2-1" },
    away: { name: "Chelsea", code: "CHE", record: "6-4-2" },
    venueCity: "London",
    winProb: 0.55,
  }),
  createGame({
    id: "mlb-nyy-lad",
    league: "MLB",
    start: formatISO(addHours(addDays(startOfDay(now), 3), 19)),
    status: "scheduled",
    home: { name: "New York Yankees", code: "NYY", record: "88-74" },
    away: { name: "Los Angeles Dodgers", code: "LAD", record: "94-68" },
    venueCity: "New York",
    winProb: 0.47,
  }),
  createGame({
    id: "ucl-real-city",
    league: "UCL",
    start: formatISO(addHours(addDays(startOfDay(now), -1), 21)),
    status: "final",
    home: { name: "Real Madrid", code: "RMA", record: "W-W-D-W-W" },
    away: { name: "Manchester City", code: "MCI", record: "L-W-W-D-W" },
    venueCity: "Madrid",
    live: { homeScore: 3, awayScore: 2, period: "FT" },
    winProb: 0.49,
  }),
  createGame({
    id: "nhl-nyr-col",
    league: "NHL",
    start: formatISO(addHours(addDays(startOfDay(now), 1), 20)),
    status: "scheduled",
    home: { name: "New York Rangers", code: "NYR", record: "14-7" },
    away: { name: "Colorado Avalanche", code: "COL", record: "12-8" },
    venueCity: "New York",
    winProb: 0.53,
  }),
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leaguesParam = searchParams.get("leagues");
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const leagues = leaguesParam
    ? leaguesParam.split(",").map((league) => league.trim()).filter(Boolean)
    : undefined;

  const fromDate = fromParam ? parseISO(fromParam) : addDays(startOfDay(now), -1);
  const toDate = toParam ? parseISO(toParam) : addDays(startOfDay(now), 7);

  const filtered = games.filter((game) => {
    if (leagues && !leagues.includes(game.league)) {
      return false;
    }
    const gameDate = parseISO(game.start);
    return (!fromDate || !isBefore(gameDate, fromDate)) && (!toDate || !isAfter(gameDate, addDays(toDate, 0)));
  });

  return Response.json({ games: filtered });
}
