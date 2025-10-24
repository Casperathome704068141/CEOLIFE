"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Game } from "@/lib/pulse/types";
import { format, isToday, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";

interface Props {
  games: Game[];
  trackedIds: Set<string>;
  onTrack: (game: Game) => void;
  onUntrack: (game: Game) => void;
  onlyWatchlist: boolean;
  onAddToBrief: (payload: { title: string; body: string }) => Promise<void>;
  focusedId?: string | null;
}

export function ScheduleCard({
  games,
  trackedIds,
  onTrack,
  onUntrack,
  onlyWatchlist,
  onAddToBrief,
  focusedId,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const todayGames = games.filter((game) => isToday(parseISO(game.start)));
  const upcoming = games.filter((game) => !isToday(parseISO(game.start)));

  const sections = [
    { title: "Today's Games", items: todayGames },
    { title: "Upcoming (7d)", items: upcoming },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>Schedule radar</span>
          <Badge variant="outline">Sports</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            {(() => {
              const visible = section.items.filter((game) => (onlyWatchlist ? trackedIds.has(game.id) : true));
              return (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {section.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">{visible.length} games</span>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {visible.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No fixtures in this window.</p>
                      ) : (
                        visible.map((game) => {
                          const tracked = trackedIds.has(game.id);
                          const start = parseISO(game.start);
                          return (
                            <motion.div
                              key={game.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="rounded-xl border border-border/60 bg-background/80 p-3"
                          style={focusedId === game.id ? { boxShadow: "0 0 0 2px hsl(var(--primary))" } : undefined}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium">
                                {game.away.name} @ {game.home.name}
                              </p>
                              <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                                <span>{game.league}</span>
                                <span>•</span>
                                <span>{format(start, "eee, MMM d p")}</span>
                                {game.venueCity ? (
                                  <>
                                    <span>•</span>
                                    <span>{game.venueCity}</span>
                                  </>
                                ) : null}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-32 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-2 rounded-full bg-primary"
                                  style={{ width: `${Math.round((game.winProb ?? 0.5) * 100)}%` }}
                                />
                              </div>
                              <Button
                                size="sm"
                                variant={tracked ? "secondary" : "outline"}
                                className="gap-1"
                                onClick={() => (tracked ? onUntrack(game) : onTrack(game))}
                              >
                                {tracked ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />} Track
                              </Button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpandedId((prev) => (prev === game.id ? null : game.id))}
                            className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary"
                          >
                            {expandedId === game.id ? "Hide detail" : "View context"}
                          </button>
                          <AnimatePresence initial={false}>
                            {expandedId === game.id ? (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 overflow-hidden pt-3 text-xs text-muted-foreground"
                              >
                                <p>
                                  Recent meetings: {game.recentMeetings?.map((meet) => `${meet.when} ${meet.result}`).join(", ")}
                                </p>
                                <p>Injuries: {game.injuries?.join(", ") ?? "No major reports"}</p>
                                <p>
                                  Weather note: {game.venueCity ? `Check latest forecast for ${game.venueCity}.` : "Indoor venue"}
                                </p>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </motion.div>
                      );
                        })
                      )}
                    </AnimatePresence>
                  </div>
                </>
              );
            })()}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Track games to sync alerts and weather overlays.</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() =>
            onAddToBrief({
              title: "Schedule roundup",
              body: "Highlight these fixtures in the Beno briefing for quick review.",
            })
          }
        >
          Add to Beno brief
        </Button>
      </CardFooter>
    </Card>
  );
}
