"use client";

import { useMemo } from "react";
import { Sparkle, Timer, WalletMinimal, HeartPulse, CalendarClock } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUIState } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { CommandMenu } from "@/components/layout/command-menu";

const contextMap: Record<string, string> = {
  "/": "MISSION CONTROL // LIVE OPS",
  "/finance": "FINANCE // LEDGER MODE",
  "/schedule": "CHRONOS // TIME BLOCKS",
  "/goals": "MISSION // OBJECTIVES",
  "/vault": "CORTEX // KNOWLEDGE TRACE",
  "/pulse": "PULSE // SYSTEM HEALTH",
  "/simulations": "SANDBOX // MODELING",
  "/household": "HABITAT // HOME NETWORK",
  "/assistant": "BENO COPILOT // OPS CHAT",
};

type HudBarProps = {
  navExpanded?: boolean;
  onToggleNav?: () => void;
};

export function HudBar({ navExpanded, onToggleNav }: HudBarProps) {
  const pathname = usePathname();
  const { setCommandPaletteOpen } = useUIState();

  const context = useMemo(() => {
    const entry = Object.entries(contextMap).find(([key]) => pathname.startsWith(key));
    return entry?.[1] ?? "BENO OS";
  }, [pathname]);

  return (
    <div className="sticky top-0 z-30 flex h-12 items-center gap-4 border-b border-slate-900/80 bg-slate-950/80 px-4 backdrop-blur">
      <CommandMenu />
      {onToggleNav && (
        <button
          type="button"
          aria-label={navExpanded ? "Collapse navigation" : "Expand navigation"}
          onClick={onToggleNav}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 text-slate-200 shadow-[0_0_20px_rgba(59,130,246,0.15)] transition hover:-translate-y-px hover:border-cyan-500/50 hover:text-white"
        >
          {navExpanded ? <Timer className="h-4 w-4" /> : <Sparkle className="h-4 w-4" />}
        </button>
      )}
      <div className="flex min-w-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
        <span className="whitespace-nowrap">{context}</span>
        <span className="hidden text-slate-600 sm:inline">//</span>
        <span className="hidden truncate text-cyan-300 sm:inline">High-Density Interaction</span>
      </div>

      <div className="mx-auto flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-1 text-xs font-semibold text-white ring-1 ring-cyan-500/30">
          <Sparkle className="h-3.5 w-3.5 text-cyan-300" />
          <span>Focus Pylon: Deep Work</span>
          <Timer className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-cyan-200">24m</span>
        </div>
      </div>

      <div className="hidden items-center gap-4 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-300 md:flex">
        <div className="flex items-center gap-1">
          <WalletMinimal className="h-4 w-4 text-emerald-400" />
          <span>$42K</span>
        </div>
        <div className="flex items-center gap-1">
          <HeartPulse className="h-4 w-4 text-rose-400" />
          <span>HRV 78</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarClock className="h-4 w-4 text-cyan-300" />
          <span>Next: 14:00 1:1</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="hidden h-9 rounded-full border border-slate-800 bg-slate-900/80 px-3 text-xs text-slate-100 hover:text-white md:inline-flex"
        onClick={() => setCommandPaletteOpen(true)}
      >
        Cmd + K
      </Button>
    </div>
  );
}
