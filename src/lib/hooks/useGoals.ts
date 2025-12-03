"use client";

import { useCollection, useUser } from "@/firebase";
import { GoalDoc } from "../schemas";

export function useGoals() {
  const { user } = useUser();

  return useCollection<GoalDoc>("goals", {
    query: ["ownerId", "==", user?.uid],
    skip: !user?.uid,
  });
}
