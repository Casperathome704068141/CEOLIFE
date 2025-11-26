
"use client";

import { useQuery } from "@tanstack/react-query";
import { Overview, GoalDoc, EventDoc, DocumentDoc, ShoppingListDoc } from "../schemas";
import { useCollection, useUser } from "@/firebase";

type OverviewResponse = {
  overview: Overview;
};

export function useBridge() {
  const { user } = useUser();
  const overviewQuery = useQuery<OverviewResponse>({
    queryKey: ["bridge", "overview"],
    queryFn: async () => {
      const response = await fetch("/api/bridge/overview");
      if (!response.ok) throw new Error("Failed to load overview");
      return response.json();
    },
    staleTime: 5000,
  });

  const { data: goals, loading: goalsLoading } = useCollection<GoalDoc>('goals', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });
  const { data: events, loading: eventsLoading } = useCollection<EventDoc>('events', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });
  const { data: documents, loading: documentsLoading } = useCollection<DocumentDoc>('documents', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });
  const { data: shoppingLists, loading: shoppingListsLoading } = useCollection<ShoppingListDoc>('shoppingLists', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });


  return {
    overview: overviewQuery.data?.overview,
    goals,
    events,
    documents,
    shoppingLists,
    loading: {
        overview: overviewQuery.isLoading,
        goals: goalsLoading,
        events: eventsLoading,
        documents: documentsLoading,
        shoppingLists: shoppingListsLoading
    }
  };
}
