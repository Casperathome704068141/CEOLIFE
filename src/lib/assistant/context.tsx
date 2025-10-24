"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type {
  AssistantMode,
  ComposerAttachment,
  ContextChip,
} from "./types";

export type AssistantContextValue = {
  mode: AssistantMode;
  setMode: (mode: AssistantMode) => void;
  chips: ContextChip[];
  toggleChip: (id: string) => void;
  attachments: ComposerAttachment[];
  addAttachment: (file: ComposerAttachment) => void;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;
};

const DEFAULT_CHIPS: ContextChip[] = [
  { id: "week", label: "This week", active: true },
  { id: "currency", label: "Currency: CAD", active: true },
  { id: "household", label: "Household: 1017", active: true },
  { id: "quiet-hours", label: "Quiet hours off", active: false },
  { id: "privacy", label: "Privacy: mask PHI", active: true },
];

const AssistantContext = createContext<AssistantContextValue | null>(null);

export function AssistantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<AssistantMode>("brief");
  const [chips, setChips] = useState<ContextChip[]>(DEFAULT_CHIPS);
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);

  const value = useMemo<AssistantContextValue>(
    () => ({
      mode,
      setMode,
      chips,
      toggleChip: (id) => {
        setChips((prev) =>
          prev.map((chip) =>
            chip.id === id ? { ...chip, active: !chip.active } : chip,
          ),
        );
      },
      attachments,
      addAttachment: (file) => {
        setAttachments((prev) => {
          const exists = prev.some((item) => item.id === file.id);
          if (exists) return prev;
          return [...prev, file];
        });
      },
      removeAttachment: (id) => {
        setAttachments((prev) => prev.filter((item) => item.id !== id));
      },
      clearAttachments: () => setAttachments([]),
    }),
    [attachments, chips, mode],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistantContext() {
  const ctx = useContext(AssistantContext);
  if (!ctx) {
    throw new Error("useAssistantContext must be used within AssistantProvider");
  }
  return ctx;
}
