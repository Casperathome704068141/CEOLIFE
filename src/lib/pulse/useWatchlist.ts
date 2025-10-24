
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { WatchlistItem } from "./types";
import { usePreferences } from "./usePreferences";

type AddPayload = Omit<WatchlistItem, "label"> & { label: string };

type WatchlistResponse = { items: WatchlistItem[] };

async function listWatchlist(): Promise<WatchlistItem[]> {
  const response = await fetch("/api/pulse/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ op: "list" }),
  });
  const data = (await response.json()) as WatchlistResponse;
  return data.items ?? [];
}

async function mutateWatchlist(op: "add" | "remove", item: WatchlistItem | AddPayload) {
  const response = await fetch("/api/pulse/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ op, item }),
  });
  if (!response.ok) {
    throw new Error("Failed to update watchlist");
  }
  return (await response.json()) as WatchlistResponse;
}

export function useWatchlist() {
  const queryClient = useQueryClient();
  const { onlyWatchlist, setOnlyWatchlist } = usePreferences();

  const { data, isLoading } = useQuery({
    queryKey: ["pulse", "watchlist"],
    queryFn: listWatchlist,
    staleTime: 1000 * 60,
  });

  const addMutation = useMutation({
    mutationFn: (item: AddPayload) => mutateWatchlist("add", item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse", "watchlist"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (item: WatchlistItem) => mutateWatchlist("remove", item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse", "watchlist"] });
    },
  });

  const items = data ?? [];
  const ids = useMemo(() => new Set(items.map((item) => item.id)), [items]);

  return {
    items,
    ids,
    isLoading,
    add: (item: AddPayload) => addMutation.mutate(item),
    remove: (item: WatchlistItem) => removeMutation.mutate(item),
    onlyWatchlist,
    setOnlyWatchlist,
  };
}
