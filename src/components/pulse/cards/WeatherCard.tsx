
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Forecast, Game } from "@/lib/pulse/types";
import { Thermometer, Wind, Umbrella } from "lucide-react";

interface Props {
  forecasts: Forecast[];
  games: Game[];
  onAddToBrief: (payload: { title: string; body: string }) => Promise<void>;
}

export function WeatherCard({ forecasts, games, onAddToBrief }: Props) {
  const gameLookup = new Map(games.map((game) => [game.id, game] as const));

  return (
    <Card className="flex h-full flex-col rounded-2xl border-border/60 bg-background/60 backdrop-blur">
      <CardHeader className="gap-3">
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span>Weather snapshot</span>
          <Badge variant="outline">Weather</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {forecasts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No weather signals linked to current filters.</p>
        ) : (
          forecasts.map((forecast) => {
            const relatedGames = (forecast.relatedGameIds ?? [])
              .map((id) => gameLookup.get(id))
              .filter(Boolean) as Game[];

            return (
              <div
                key={forecast.city}
                className="space-y-3 rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{forecast.city}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(forecast.when).toLocaleString([], {
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Thermometer className="h-3 w-3" /> {forecast.temp}°
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Wind className="h-3 w-3" /> {forecast.wind} mph
                  </span>
                  <span className="flex items-center gap-1">
                    <Umbrella className="h-3 w-3" /> {(forecast.rainProb * 100).toFixed(0)}% rain
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{forecast.note}</p>
                {relatedGames.length ? (
                  <div className="space-y-1 pt-2 text-xs text-muted-foreground">
                    {relatedGames.map((game) => (
                      <p key={game.id}>
                        Impact → {game.away.name} @ {game.home.name}: watch adjustments for wind & surface.
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Atmospherics blend local radar with market overlays.</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() =>
            onAddToBrief({
              title: "Weather watch",
              body: "Surface key weather risks in the Beno briefing for travel & strategy.",
            })
          }
        >
          Add to Beno brief
        </Button>
      </CardFooter>
    </Card>
  );
}
