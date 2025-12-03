"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { CommandRail } from "@/components/layout/command-rail";
import { HudBar } from "@/components/layout/hud-bar";
import { ModuleErrorBoundary } from "@/components/layout/module-error-boundary";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [railExpanded, setRailExpanded] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setRailExpanded(mq.matches);
    const handler = (event: MediaQueryListEvent) => setRailExpanded(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const paddingClass = useMemo(
    () => cn("flex flex-1 flex-col transition-[padding] duration-300", railExpanded ? "md:pl-64 pl-16" : "pl-16 md:pl-20"),
    [railExpanded]
  );

  return (
    <AuthGate>
      <div className="relative flex min-h-screen bg-slate-950 text-slate-50">
        <CommandRail expanded={railExpanded} onToggle={() => setRailExpanded((prev) => !prev)} />
        <div className={paddingClass}>
          <HudBar navExpanded={railExpanded} onToggleNav={() => setRailExpanded((prev) => !prev)} />
          <main className="flex-1 px-4 pb-12 pt-6 sm:px-6 md:px-10">
            <div className="mx-auto w-full max-w-7xl space-y-8 pb-10">
              <ModuleErrorBoundary>
                <div className="space-y-6 rounded-3xl border border-slate-900/70 bg-slate-900/40 p-2 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                  {children}
                </div>
              </ModuleErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </AuthGate>
  );
}
