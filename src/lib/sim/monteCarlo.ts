import { addMonths } from "date-fns";
import { MonteCarloRequest, MonteCarloResult, MonteCarloHistogramBin } from "./types";
import { projectWithNoise, runSimulation } from "./runSimulation";

function createRng(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function runMonteCarloSimulation(input: MonteCarloRequest): MonteCarloResult {
  const trials = Math.max(10, Math.min(input.trials ?? 100, 2000));
  const rng = createRng(input.seed ?? 42);
  const runs = [];

  for (let index = 0; index < trials; index++) {
    const random = createRng(Math.floor(rng() * 1_000_000));
    const result = projectWithNoise(input, input.volatility, random);
    runs.push(result);
  }

  const horizon = Math.max(...runs.map((run) => run.monthly.length));
  const percentiles = [] as MonteCarloResult["percentiles"];

  for (let month = 0; month < horizon; month++) {
    const balances: number[] = [];
    const baseDate = addMonths(new Date(input.baselineDate ?? new Date().toISOString()), month).toISOString();
    for (const run of runs) {
      const point = run.monthly[month] ?? run.monthly[run.monthly.length - 1];
      balances.push(point.balance);
    }
    balances.sort((a, b) => a - b);
    const getPercentile = (p: number) => {
      const index = Math.floor((p / 100) * (balances.length - 1));
      return balances[index] ?? balances[balances.length - 1] ?? 0;
    };
    percentiles.push({
      date: baseDate,
      p10: getPercentile(10),
      p25: getPercentile(25),
      p50: getPercentile(50),
      p75: getPercentile(75),
      p90: getPercentile(90),
    });
  }

  const lastBalances = runs.map((run) => run.monthly[run.monthly.length - 1]?.balance ?? 0);
  const minBalance = Math.min(...lastBalances);
  const maxBalance = Math.max(...lastBalances);
  const bucketSize = Math.max(Math.round((maxBalance - minBalance) / 12), 100);
  const histogramMap = new Map<number, number>();

  for (const value of lastBalances) {
    const bucket = Math.floor((value - minBalance) / bucketSize);
    histogramMap.set(bucket, (histogramMap.get(bucket) ?? 0) + 1);
  }

  const histogram: MonteCarloHistogramBin[] = Array.from(histogramMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([bucket, count]) => ({ bucket: minBalance + bucket * bucketSize, count }));

  const deficitProbability = runs.filter((run) => run.monthly.some((point) => point.balance < 0)).length / runs.length;

  return {
    percentiles,
    histogram,
    deficitProbability,
  };
}

export function summarizeMedianPath(result: MonteCarloResult) {
  return runSimulation({
    params: {
      horizonMonths: result.percentiles.length,
      incomeDeltaPct: 0,
    },
  });
}
