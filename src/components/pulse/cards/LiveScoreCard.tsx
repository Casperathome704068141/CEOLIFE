
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Game } from "@/lib/pulse/types";
import { motion } from "framer-motion";
import { Flame, Activity } from "lucide-react";

interface Props {
  games: Game[];
  onAddToBrief: (payload: { title: string; body: string }) => Promise<void>;
}

function isCloseGame(game: Game) {
  const home = game.live?.homeScore ?? 0;
  const away = game.live?.awayScore ?? 0;
  const diff = Math.abs(home - away);
  if (game.league === "NBA") return diff <= 5;
  if (game.league === "NFL") return diff <= 7;
  if (game.league === "MLB" || game.league === "EPL" || game.league === "UCL") return diff <= 1;
  return diff <= 3;
}

export function LiveScoreCard({ games, onAddToBrief }: Props) {
  const liveGames = games.filter((game) => game.status === "live");

  return (
    <Card className="flex flex-col rounded-2xl border-border/60 bg-background/60 backdrop-blur">
      <CardHeader className="gap-3">
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span>Live scoreboard</span>
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" /> 60s auto-refresh
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {liveGames.length === 0 ? (
          <p className="text-sm text-muted-foreground">No live events right now.</p>
        ) : (
          liveGames.map((game) => {
            const close = isCloseGame(game);
            return (
              <motion.div
                key={game.id}
                layout
                className="space-y-2 rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {game.away.name} {game.live?.awayScore} — {game.home.name} {game.live?.homeScore}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {game.league} • {game.live?.period ?? "Live"} • Clock {game.live?.clock ?? "--"}
                    </p>
                  </div>
                  {close ? (
                    <Badge variant="secondary" className="gap-1 bg-rose-500/20 text-rose-200">
                      <Flame className="h-3 w-3" /> Close game
                    </Badge>
                  ) : null}
                </div>
              </motion.div>
            );
          })
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Live feeds merge scoreboard, drive charts and sentiment pulses.</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() =>
            onAddToBrief({
              title: "Live alerts",
              body: "Add the hottest live games to the Beno briefing for quick sharing.",
            })
          }
        >
          Add to Beno brief
        </Button>
      </CardFooter>
    </Card>
  );
}
