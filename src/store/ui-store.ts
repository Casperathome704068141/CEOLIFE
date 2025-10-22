import { create } from "zustand";

type ProfileRole = "head" | "household" | "guest";

type UIState = {
  isCommandPaletteOpen: boolean;
  notificationsOpen: boolean;
  activeProfile: ProfileRole;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleNotifications: () => void;
  setActiveProfile: (role: ProfileRole) => void;
};

export const useUIState = create<UIState>((set) => ({
  isCommandPaletteOpen: false,
  notificationsOpen: false,
  activeProfile: "head",
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleNotifications: () =>
    set((state) => ({ notificationsOpen: !state.notificationsOpen })),
  setActiveProfile: (role) => set({ activeProfile: role }),
}));
