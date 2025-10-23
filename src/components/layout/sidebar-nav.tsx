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
  Shield,
  Settings,
  ShoppingCart,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/finance/overview", icon: Wallet, label: "Finance" },
  { href: "/vault/documents", icon: FileText, label: "Vault" },
  { href: "/schedule/calendar", icon: Calendar, label: "Schedule" },
  { href: "/household/members", icon: Users, label: "Household" },
  { href: "/goals", icon: Target, label: "Goals" },
  { href: "/simulations/scenarios", icon: BrainCircuit, label: "Simulations" },
  { href: "/wellness/overview", icon: Activity, label: "Wellness" },
  { href: "/assistant", icon: Bot, label: "Beno" },
  { href: "/security/privacy", icon: Shield, label: "Security" },
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
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
                className="rounded-2xl text-sm font-medium"
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
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
