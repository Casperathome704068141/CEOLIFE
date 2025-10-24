"use client";

import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { DateRange, usePreferences } from "@/lib/pulse/usePreferences";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const leagueOptions = ["NBA", "NFL", "MLB", "NHL", "EPL", "UCL", "F1"];
const dateOptions: { id: DateRange; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
];

export const LeagueFilter = forwardRef<HTMLDivElement>(function LeagueFilter(_props, ref) {
  const { selectedLeagues, toggleLeague, dateRange, setDateRange } = usePreferences();

  return (
    <div ref={ref} className="rounded-2xl border border-border/60 bg-background/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Filter leagues
          </p>
          <p className="text-xs text-muted-foreground">
            Personalize the dashboard to focus on the competitions that matter right now.
          </p>
        </div>
        <div className="flex gap-2 rounded-full border border-border/70 bg-background/80 p-1">
          {dateOptions.map((option) => (
            <Button
              key={option.id}
              size="sm"
              variant={dateRange === option.id ? "default" : "ghost"}
              className={cn("h-7 px-3 text-xs", dateRange === option.id && "shadow")}
              onClick={() => setDateRange(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {leagueOptions.map((league) => {
          const active = selectedLeagues.includes(league);
          return (
            <button
              key={league}
              type="button"
              onClick={() => toggleLeague(league)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/80 text-muted-foreground hover:border-primary/40"
              )}
            >
              {league}
              {active ? <Badge variant="secondary" className="text-[10px]">ON</Badge> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
});
