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
  LayoutGrid,
  LifeBuoy,
  Settings,
  ShieldHalf,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: LayoutGrid, label: "Mission Control" },
  { href: "/capital", icon: Wallet, label: "Capital" },
  { href: "/chronos", icon: Calendar, label: "Chronos" },
  { href: "/habitat", icon: Home, label: "Habitat" },
  { href: "/pulse", icon: Activity, label: "Vitality" },
  { href: "/vault", icon: ShieldHalf, label: "Vault" },
  { href: "/simulations", icon: BrainCircuit, label: "Simulations" },
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
        <div className="space-y-1">
          <SidebarMenu>
            {navItems.map((item) => (
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
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Assistant" className="rounded-2xl text-sm">
              <Link href="/assistant" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span>Assistant</span>
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