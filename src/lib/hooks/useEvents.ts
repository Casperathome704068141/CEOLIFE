"use client";

import { useCollection, useUser } from "@/firebase";
import { EventDoc } from "../schemas";

export function useEvents() {
  const { user } = useUser();

  return useCollection<EventDoc>("events", {
    query: ["ownerId", "==", user?.uid],
    skip: !user?.uid,
  });
}
