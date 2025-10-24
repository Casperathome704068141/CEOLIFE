import { NextRequest } from "next/server";
import { OddsRow } from "@/lib/pulse/types";
import { valueScore } from "@/lib/pulse/valueScore";

const baseOdds: Array<Omit<OddsRow, "valueScore"> & { inputs: {
  implied: number;
  marketAvgImplied: number;
  lineMove: number;
  formIndex: number;
  weatherImpact: number;
  sentimentSkew: number;
} }> = [
  {
    id: "nba-lal-bos-moneyline",
    gameId: "nba-lal-bos",
    league: "NBA",
    market: "moneyline",
    selection: "Lakers",
    line: null,
    price: 1.85,
    marketAvg: 1.8,
    implied: 0.54,
    delta: 0.04,
    books: [
      { name: "Book A", price: 1.85 },
      { name: "Book B", price: 1.81 },
      { name: "Book C", price: 1.79 },
    ],
    inputs: {
      implied: 0.54,
      marketAvgImplied: 0.56,
      lineMove: 0.8,
      formIndex: 0.64,
      weatherImpact: 0.02,
      sentimentSkew: 0.42,
    },
  },
  {
    id: "nfl-kc-buf-spread",
    gameId: "nfl-kc-buf",
    league: "NFL",
    market: "spread",
    selection: "Chiefs -3.5",
    line: -3.5,
    price: -110,
    marketAvg: -115,
    implied: 0.52,
    delta: 0.03,
    books: [
      { name: "Book A", price: -110, line: -3.5 },
      { name: "Book B", price: -112, line: -3.5 },
      { name: "Book C", price: -118, line: -4 },
    ],
    inputs: {
      implied: 0.52,
      marketAvgImplied: 0.54,
      lineMove: 1.1,
      formIndex: 0.72,
      weatherImpact: -0.01,
      sentimentSkew: 0.65,
    },
  },
  {
    id: "epl-ars-che-total",
    gameId: "epl-ars-che",
    league: "EPL",
    market: "total",
    selection: "Over 2.5",
    line: 2.5,
    price: 1.95,
    marketAvg: 1.9,
    implied: 0.51,
    delta: 0.05,
    books: [
      { name: "Book A", price: 1.95, line: 2.5 },
      { name: "Book B", price: 1.91, line: 2.5 },
      { name: "Book C", price: 1.88, line: 2.75 },
    ],
    inputs: {
      implied: 0.51,
      marketAvgImplied: 0.53,
      lineMove: 0.4,
      formIndex: 0.61,
      weatherImpact: -0.03,
      sentimentSkew: 0.38,
    },
  },
  {
    id: "nhl-nyr-col-moneyline",
    gameId: "nhl-nyr-col",
    league: "NHL",
    market: "moneyline",
    selection: "Rangers",
    line: null,
    price: 1.92,
    marketAvg: 1.88,
    implied: 0.52,
    delta: 0.04,
    books: [
      { name: "Book A", price: 1.92 },
      { name: "Book B", price: 1.89 },
      { name: "Book C", price: 1.87 },
    ],
    inputs: {
      implied: 0.52,
      marketAvgImplied: 0.54,
      lineMove: 0.6,
      formIndex: 0.58,
      weatherImpact: 0,
      sentimentSkew: 0.46,
    },
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leaguesParam = searchParams.get("leagues");
  const leagues = leaguesParam
    ? leaguesParam.split(",").map((league) => league.trim()).filter(Boolean)
    : undefined;

  const odds: OddsRow[] = baseOdds
    .filter((row) => (leagues ? leagues.includes(row.league) : true))
    .map(({ inputs, ...row }) => ({
      ...row,
      lineMove: inputs.lineMove,
      formIndex: inputs.formIndex,
      weatherImpact: inputs.weatherImpact,
      sentimentSkew: inputs.sentimentSkew,
      valueScore: Number(valueScore(inputs).toFixed(2)),
    }));

  return Response.json({ odds });
}
