
"use client";

import Link from "next/link";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Activity,
  Bot,
  BrainCircuit,
  Calendar,
  FileText,
  Home,
  LifeBuoy,
  Settings,
  ShoppingCart,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";

type NavSection = {
  heading: string;
  items: Array<{ href: string; icon: typeof Home; label: string; badge?: string }>;
};

const navSections: NavSection[] = [
  {
    heading: "Command",
    items: [
      { href: "/", icon: Home, label: "Mission control" },
      { href: "/assistant", icon: Bot, label: "BENO copilot" },
    ],
  },
  {
    heading: "Operations",
    items: [
      { href: "/finance/overview", icon: Wallet, label: "Finance" },
      { href: "/schedule/calendar", icon: Calendar, label: "Schedule" },
      { href: "/household", icon: Users, label: "Household" },
      { href: "/goals", icon: Target, label: "Goals" },
    ],
  },
  {
    heading: "Systems",
    items: [
      { href: "/vault/documents", icon: FileText, label: "Vault" },
      { href: "/simulations/scenarios", icon: BrainCircuit, label: "Simulations" },
      { href: "/pulse", icon: Activity, label: "Pulse" },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-3">
          <Bot className="h-9 w-9 text-cyan-400" />
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-cyan-400/70">Life OS</div>
            <h1 className="text-xl font-headline font-semibold text-white">BENO 1017</h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {navSections.map((section) => (
          <div key={section.heading} className="space-y-1">
            <p className="px-3 text-[11px] uppercase tracking-[0.3em] text-slate-500/70">
              {section.heading}
            </p>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                    className="group rounded-2xl text-sm font-medium transition hover:border-slate-700/80"
                  >
                    <Link href={item.href} className="flex w-full items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/60 text-slate-400 transition-colors group-data-[active=true]:bg-cyan-500/15 group-data-[active=true]:text-cyan-300"
                        >
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="text-slate-200 group-data-[active=true]:text-white">{item.label}</span>
                      </span>
                      {item.badge ? (
                        <span className="rounded-full bg-slate-900/60 px-2 py-1 text-[10px] uppercase tracking-wide text-cyan-300/80">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Onboarding" className="rounded-2xl text-sm">
              <Link href="/onboarding" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Quick setup</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings" className="rounded-2xl text-sm">
              <Link href="/security/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Support" className="rounded-2xl text-sm">
              <Link href="/assistant" className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4" />
                <span>Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
