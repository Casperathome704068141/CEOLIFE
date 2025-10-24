
"use client";

import { useWatchlist } from "@/lib/pulse/useWatchlist";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePreferences } from "@/lib/pulse/usePreferences";

interface Props {
  onSelect?: (id: string) => void;
}

export function WatchlistBar({ onSelect }: Props) {
  const { items, remove } = useWatchlist();
  const { onlyWatchlist, setOnlyWatchlist } = usePreferences();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Watchlist
          </p>
          <p className="text-xs text-muted-foreground">
            Track live opportunities you pinned. Syncs with your account preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="watchlist-toggle"
            checked={onlyWatchlist}
            onCheckedChange={(value) => setOnlyWatchlist(value)}
          />
          <Label htmlFor="watchlist-toggle" className="text-xs text-muted-foreground">
            Only watchlist
          </Label>
        </div>
      </div>
      <ScrollArea className="whitespace-nowrap">
        <div className="flex gap-2">
          {items.length === 0 ? (
            <span className="text-xs text-muted-foreground">No tracked items yet.</span>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect?.(item.id)}
                className="group flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs shadow-sm transition hover:border-primary/40 hover:text-primary"
              >
                <span>{item.label}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 rounded-full p-0 opacity-0 transition group-hover:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    remove(item);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </button>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </div>
  );
}
