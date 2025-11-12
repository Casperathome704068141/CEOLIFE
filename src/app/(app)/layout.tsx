
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { AuthGate } from "@/components/auth/auth-gate";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGate>
      <SidebarProvider>
        <Sidebar className="border-r border-slate-900/70 bg-slate-950/90">
          <SidebarNav />
        </Sidebar>
        <SidebarInset>
          <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-930/80 to-slate-950">
            <Header />
            <main className="flex-1 px-4 pb-12 sm:px-6 md:px-10">
              <div className="mx-auto w-full max-w-7xl space-y-8 pb-6">{children}</div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGate>
  );
}
