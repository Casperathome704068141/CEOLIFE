"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Preferences } from "./types";

type DateRange = "today" | "7d" | "30d";

type PulsePreferencesState = {
  selectedLeagues: string[];
  dateRange: DateRange;
  onlyWatchlist: boolean;
  saved?: Preferences;
  setLeagues: (leagues: string[]) => void;
  toggleLeague: (league: string) => void;
  setDateRange: (range: DateRange) => void;
  setOnlyWatchlist: (value: boolean) => void;
  setSavedPreferences: (prefs: Preferences) => void;
};

export const usePreferences = create<PulsePreferencesState>()(
  immer((set) => ({
    selectedLeagues: ["NBA", "NFL", "EPL"],
    dateRange: "today",
    onlyWatchlist: false,
    setLeagues: (leagues) =>
      set((state) => {
        state.selectedLeagues = leagues;
      }),
    toggleLeague: (league) =>
      set((state) => {
        const exists = state.selectedLeagues.includes(league);
        state.selectedLeagues = exists
          ? state.selectedLeagues.filter((l) => l !== league)
          : [...state.selectedLeagues, league];
      }),
    setDateRange: (range) =>
      set((state) => {
        state.dateRange = range;
      }),
    setOnlyWatchlist: (value) =>
      set((state) => {
        state.onlyWatchlist = value;
      }),
    setSavedPreferences: (prefs) =>
      set((state) => {
        state.saved = prefs;
        if (prefs.leagues?.length) {
          state.selectedLeagues = prefs.leagues;
        }
      }),
  }))
);

export type { DateRange };
