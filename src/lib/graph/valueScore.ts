export type ValueScoreInput = {
  impliedProb: number;
  marketOdds: number;
  line: number;
  modelEdge: number;
  injuryAdj: number;
  weatherAdj: number;
};

export type ValueScoreResult = {
  score: number;
  explain: string[];
};

function normalizeProbability(prob: number) {
  if (!Number.isFinite(prob)) return 0;
  return Math.max(0, Math.min(1, prob));
}

function impliedFromOdds(odds: number) {
  if (odds === 0) return 0.5;
  if (odds > 0) {
    return 100 / (odds + 100);
  }
  return Math.abs(odds) / (Math.abs(odds) + 100);
}

export function valueScore(input: ValueScoreInput): ValueScoreResult {
  const implied = normalizeProbability(input.impliedProb);
  const market = normalizeProbability(impliedFromOdds(input.marketOdds));
  const edge = input.modelEdge;
  const injuryPenalty = input.injuryAdj;
  const weatherPenalty = input.weatherAdj;

  const probabilityGain = implied - market;
  const edgeContribution = edge / 10;
  const adjustmentPenalty = (injuryPenalty + weatherPenalty) / 2;

  const rawScore = probabilityGain * 10 + edgeContribution - adjustmentPenalty;
  const score = Math.max(0, Math.min(10, Number(rawScore.toFixed(2))));

  const explain = [
    `Model probability ${Math.round(implied * 100)}% vs market ${Math.round(market * 100)}%`,
    `Edge contribution: ${edgeContribution.toFixed(2)}`,
  ];

  if (injuryPenalty !== 0) {
    explain.push(`Injury adjustment −${injuryPenalty.toFixed(2)}`);
  }
  if (weatherPenalty !== 0) {
    explain.push(`Weather adjustment −${weatherPenalty.toFixed(2)}`);
  }

  explain.push(`Final score ${score.toFixed(2)} (0-10)`);

  return { score, explain };
}

