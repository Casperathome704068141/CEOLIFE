
import type { Metadata } from "next";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { AppProviders } from "@/components/providers/app-providers";
import { FirebaseClientProvider } from "@/firebase/client-provider";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <FirebaseClientProvider>
        <SidebarProvider>
          <Sidebar className="border-r border-slate-900/70 bg-slate-950/90">
            <SidebarNav />
          </Sidebar>
          <SidebarInset>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-930 to-slate-950">
              <Header />
              <main className="flex-1 px-4 pb-12 sm:px-6 md:px-8">{children}</main>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </FirebaseClientProvider>
    </AppProviders>
  );
}
