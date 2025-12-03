"use client";

import { useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { CommandRail } from "@/components/layout/command-rail";
import { HudBar } from "@/components/layout/hud-bar";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [railExpanded, setRailExpanded] = useState(false);

  return (
    <AuthGate>
      <div className="relative flex min-h-screen bg-slate-950 text-slate-50">
        <CommandRail expanded={railExpanded} onToggle={() => setRailExpanded((prev) => !prev)} />
        <div className={cn("flex flex-1 flex-col transition-[padding] duration-300", railExpanded ? "pl-64" : "pl-16") }>
          <HudBar />
          <main className="flex-1 px-4 pb-12 pt-6 sm:px-6 md:px-10">
            <div className="mx-auto w-full max-w-7xl space-y-8 pb-10">{children}</div>
          </main>
        </div>
      </div>
    </AuthGate>
  );
}
