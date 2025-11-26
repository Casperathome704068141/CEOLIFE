"use client";

import { AuthGate } from "@/components/auth/auth-gate";
import { CommandRail } from "@/components/layout/command-rail";
import { HudBar } from "@/components/layout/hud-bar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGate>
      <div className="relative flex min-h-screen bg-slate-950 text-slate-50">
        <CommandRail />
        <div className="flex flex-1 flex-col pl-16">
          <HudBar />
          <main className="flex-1 px-4 pb-12 pt-6 sm:px-6 md:px-10">
            <div className="mx-auto w-full max-w-7xl space-y-8 pb-10">{children}</div>
          </main>
        </div>
      </div>
    </AuthGate>
  );
}
