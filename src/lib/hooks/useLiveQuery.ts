"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useLiveQuery() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource("/api/events/stream");

    eventSource.onmessage = event => {
      try {
        const payload = JSON.parse(event.data) as { keys?: string[] };
        if (!payload?.keys) return;
        payload.keys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key.split(":") });
        });
      } catch (error) {
        console.error("Failed to parse SSE payload", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);
}

