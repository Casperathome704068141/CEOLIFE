"use client";

import { useQuery } from "@tanstack/react-query";
import { Overview } from "../schemas";

type OverviewResponse = {
  overview: Overview;
};

export function useOverview() {
  const { data, isLoading } = useQuery<OverviewResponse>({
    queryKey: ["bridge", "overview"],
    queryFn: async () => {
      const response = await fetch("/api/bridge/overview");
      if (!response.ok) throw new Error("Failed to load overview");
      return response.json();
    },
    staleTime: 5000,
  });

  return { overview: data?.overview, isLoading };
}
