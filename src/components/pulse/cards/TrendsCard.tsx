
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendsPayload } from "@/lib/pulse/types";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";

interface Props {
  trends: TrendsPayload;
  onAddToBrief: (payload: { title: string; body: string }) => Promise<void>;
}

export function TrendsCard({ trends, onAddToBrief }: Props) {
  const labels = Array.from(new Set(trends.lineMoves.map((move) => move.label ?? move.id)));
  const timestamps = Array.from(new Set(trends.lineMoves.map((move) => move.t)));
  const chartData = timestamps.map((t) => {
    const base: Record<string, number | string> = { t };
    labels.forEach((label) => {
      const values = trends.lineMoves
        .filter((move) => (move.label ?? move.id) === label && move.t === t)
        .map((move) => move.value);
      base[label] = values.length ? Number((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2)) : 0;
    });
    return base;
  });

  const colors = ["#38bdf8", "#22d3ee", "#a855f7", "#f97316"];

  return (
    <Card className="col-span-full flex h-full flex-col rounded-2xl border-border/60 bg-background/60 backdrop-blur">
      <CardHeader className="gap-3">
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span>Trends intelligence</span>
          <span className="text-xs text-muted-foreground">Line moves • Sentiment • Momentum</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        {trends.lineMoves.length === 0 ? (
          <p className="text-sm text-muted-foreground">Trends will populate as leagues with activity are selected.</p>
        ) : null}
        {chartData.length > 0 ? (
          <div className="h-64 w-full overflow-hidden rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="t" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ fontSize: 12, backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                {labels.map((label, index) => (
                  <Line
                    key={label}
                    type="monotone"
                    dataKey={label}
                    strokeWidth={2}
                    stroke={colors[index % colors.length]}
                    name={label}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Momentum heat</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {trends.momentumHeat.map((item) => (
                <div
                  key={`${item.id}-${item.label}`}
                  className="rounded-lg p-3 text-xs font-medium text-background"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--primary)) ${Math.round(item.score * 100)}%, rgba(148,163,184,0.4))`,
                  }}
                >
                  <p>{item.label}</p>
                  <p className="text-[10px] text-background/70">Index {(item.score * 100).toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sentiment split</p>
            <div className="space-y-3">
              {trends.sentiment.map((row) => (
                <div key={row.league} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{row.league}</span>
                    <span>Bullish {(row.bullish * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, Math.round(row.bullish * 100))}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Bearish {(row.bearish * 100).toFixed(0)}% of tracked public slips.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Trends overlay on each card when you pin items to the watchlist.</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() =>
            onAddToBrief({
              title: "Trend digest",
              body: "Summarize line movement & sentiment shifts in the Beno briefing.",
            })
          }
        >
          Add to Beno brief
        </Button>
      </CardFooter>
    </Card>
  );
}
