
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "@/lib/pulse/types";
import { valueScoreBand } from "@/lib/pulse/valueScore";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import { Bell, Plus } from "lucide-react";

interface Props {
  plays: Play[];
  onAlert: (play: Play) => void;
  onTrack: (play: Play) => void;
  trackedIds: Set<string>;
  onAddToBrief: (payload: { title: string; body: string }) => Promise<void>;
}

export function BestPlaysCard({ plays, onAlert, onTrack, trackedIds, onAddToBrief }: Props) {
  return (
    <Card className="flex h-full flex-col rounded-2xl border-border/60 bg-background/60 backdrop-blur">
      <CardHeader className="gap-3">
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span>Best plays insight</span>
          <Badge variant="outline">AI blend</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {plays.length === 0 ? (
          <p className="text-sm text-muted-foreground">No value plays surfaced for the current filters.</p>
        ) : (
          plays.map((play) => {
            const band = valueScoreBand(play.valueScore);
            const tracked = trackedIds.has(play.id);
            return (
              <div key={play.id} className="space-y-3 rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{play.pick}</p>
                    <p className="text-xs text-muted-foreground">
                      {play.league} • {play.market.toUpperCase()} • Confidence {(play.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  <Badge className={band.className}>{play.valueScore.toFixed(1)}</Badge>
                </div>
                <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-2">
                  <div className="h-24 w-full">
                    <ResponsiveContainer>
                      <AreaChart data={play.sparkline}>
                        <defs>
                          <linearGradient id={`spark-${play.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          labelFormatter={(label) => label}
                          formatter={(value: number) => [value.toFixed(2), "Value"]}
                          contentStyle={{
                            fontSize: 12,
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fill={`url(#spark-${play.id})`}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {play.rationale.map((line) => (
                      <li key={line} className="leading-5">• {line}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onTrack(play)}>
                    <Plus className="mr-1 h-4 w-4" /> {tracked ? "Tracked" : "Track"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onAlert(play)}>
                    <Bell className="mr-1 h-4 w-4" /> Set alert
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Summaries combine odds, weather and form context.</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() =>
            onAddToBrief({
              title: "Best plays",
              body: "Drop these AI-curated plays into the Beno briefing for decision review.",
            })
          }
        >
          Add to Beno brief
        </Button>
      </CardFooter>
    </Card>
  );
}
