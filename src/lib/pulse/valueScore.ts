
import { Inputs as ValueScoreInputs } from "./valueScore.types";

export function valueScore(i: ValueScoreInputs) {
  const edge = i.marketAvgImplied - i.implied;
  const momentum = Math.tanh(i.lineMove / 2);
  const contrarian = 0.5 - Math.abs(i.sentimentSkew - 0.5);
  const base =
    5 +
    20 * edge +
    2 * momentum +
    5 * contrarian +
    5 * i.weatherImpact +
    3 * (i.formIndex - 0.5);
  return Math.max(0, Math.min(10, base));
}

export function valueScoreBand(score: number) {
  if (score >= 8) return { label: "rare", className: "text-emerald-400" };
  if (score >= 6) return { label: "opportunity", className: "text-lime-400" };
  if (score >= 3) return { label: "caution", className: "text-amber-400" };
  return { label: "neutral", className: "text-slate-400" };
}
