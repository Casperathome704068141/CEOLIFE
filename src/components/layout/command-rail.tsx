"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bot,
  BrainCircuit,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Layers,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", icon: Home, label: "Mission Control" },
  { href: "/assistant", icon: Bot, label: "BENO Copilot" },
  { href: "/finance/overview", icon: Wallet, label: "Finance" },
  { href: "/schedule/calendar", icon: Calendar, label: "Schedule" },
  { href: "/household", icon: Users, label: "Household" },
  { href: "/goals", icon: Target, label: "Goals" },
  { href: "/vault/documents", icon: FileText, label: "Vault" },
  { href: "/simulations/scenarios", icon: BrainCircuit, label: "Simulations" },
  { href: "/pulse", icon: Activity, label: "Pulse" },
];

type CommandRailProps = {
  expanded: boolean;
  onToggle: () => void;
};

export function CommandRail({ expanded, onToggle }: CommandRailProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-900/70 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950/80 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-[width] duration-300",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex h-16 items-center gap-3 px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/40">
            <Layers className="h-5 w-5" />
          </div>
          <div
            className={cn(
              "flex flex-col overflow-hidden transition-opacity duration-300",
              expanded ? "opacity-100" : "opacity-0"
            )}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Life OS</span>
            <span className="text-sm font-semibold text-white">BENO v3.0</span>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-2 pb-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group/item flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition",
                  "hover:bg-slate-900/70 hover:text-white",
                  isActive
                    ? "bg-slate-900/80 text-white ring-1 ring-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
                    : "text-slate-400"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/70 text-slate-400",
                    isActive && "bg-cyan-500/15 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                </span>
                <span
                  className={cn(
                    "truncate transition-opacity duration-300",
                    expanded ? "opacity-100" : "opacity-0"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center justify-between px-3 pb-4">
        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden transition-opacity duration-300",
            expanded ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Pulse</div>
          <div className="text-xs font-semibold text-green-400">Nominal</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-lg" />
            <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:border-cyan-500/50 hover:text-white"
            onClick={onToggle}
            aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
          >
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </aside>
  );
}
