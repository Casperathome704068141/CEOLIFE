
"use client";

import { useCallback } from "react";
import { collection, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFirestore, useCollection, useUser } from "@/firebase";
import {
  MonteCarloRequest,
  MonteCarloResult,
  PlanChangeSummary,
  RunSimulationInput,
  Scenario,
  ScenarioParameters,
  SimResult,
} from "./types";

const COLLECTION_PATH = "simulations";

export function useSimulations() {
  const firestore = useFirestore();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { data: scenarios = [], isLoading } = useCollection<Scenario>(COLLECTION_PATH, {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });

  const createScenario = useMutation({
    mutationFn: async (input: { name: string; preset?: Scenario["preset"]; params: ScenarioParameters }) => {
      if (!firestore || !user?.uid) throw new Error("Firestore not ready");
      const col = collection(firestore, COLLECTION_PATH);
      const now = Date.now();
      const docRef = await addDoc(col, {
        ownerId: user.uid,
        name: input.name,
        preset: input.preset ?? "custom",
        params: input.params,
        assumptions: {},
        shocks: [],
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations", "scenarios"] });
    },
  });

  const updateScenario = useMutation({
    mutationFn: async (input: { id: string; data: Partial<Omit<Scenario, "id">> }) => {
      if (!firestore) throw new Error("Firestore not ready");
      const docRef = doc(firestore, COLLECTION_PATH, input.id);
      await updateDoc(docRef, { ...input.data, updatedAt: Date.now() });
      return input.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations", "scenarios"] });
    },
  });

  const deleteScenario = useMutation({
    mutationFn: async (id: string) => {
      if (!firestore) throw new Error("Firestore not ready");
      const docRef = doc(firestore, COLLECTION_PATH, id);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations", "scenarios"] });
    },
  });

  const run = useCallback(async (input: RunSimulationInput): Promise<SimResult> => {
    const response = await fetch("/api/simulations/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Failed to run simulation");
    const data = (await response.json()) as { result: SimResult };
    return data.result;
  }, []);

  const runMonteCarlo = useCallback(async (input: MonteCarloRequest): Promise<MonteCarloResult> => {
    const response = await fetch("/api/simulations/montecarlo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Failed to run Monte Carlo");
    const data = (await response.json()) as { result: MonteCarloResult };
    return data.result;
  }, []);

  const applyPlan = useCallback(async (changes: PlanChangeSummary) => {
    const response = await fetch("/api/simulations/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    if (!response.ok) throw new Error("Failed to apply plan");
  }, []);

  return {
    scenarios: scenarios ?? [],
    isLoading,
    createScenario: createScenario.mutateAsync,
    updateScenario: updateScenario.mutateAsync,
    deleteScenario: deleteScenario.mutateAsync,
    run,
    runMonteCarlo,
    applyPlan,
  };
}
