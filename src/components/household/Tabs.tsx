"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs as UITabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useHousehold } from "@/lib/household/useHousehold";

export interface HouseholdTabItem {
  id: string;
  label: string;
  shortcut: string;
  content: React.ReactNode;
  onAdd?: () => void;
  onNudge?: () => void;
  onFilter?: () => void;
}

interface HouseholdTabsProps {
  items: HouseholdTabItem[];
}

export function HouseholdTabs({ items }: HouseholdTabsProps) {
  const { activeTab, setActiveTab } = useHousehold();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      const key = event.key.toLowerCase();
      if (!event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
        const match = items.find((item) => item.shortcut.toLowerCase() === key);
        if (match) {
          event.preventDefault();
          setActiveTab(match.id);
          return;
        }
        if (key === "n") {
          const current = items.find((item) => item.id === activeTab);
          if (current?.onAdd) {
            event.preventDefault();
            current.onAdd();
          }
        }
      }

      if ((event.metaKey || event.ctrlKey) && key === "f") {
        const current = items.find((item) => item.id === activeTab);
        if (current?.onFilter) {
          event.preventDefault();
          current.onFilter();
        }
      }

      if (event.shiftKey && key === "n") {
        const current = items.find((item) => item.id === activeTab);
        if (current?.onNudge) {
          event.preventDefault();
          current.onNudge();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, activeTab, setActiveTab]);

  const active = items.find((item) => item.id === activeTab) ?? items[0];

  return (
    <div className="space-y-6">
      <UITabs value={active.id} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="flex w-full flex-wrap gap-2 bg-transparent p-0">
          {items.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className={cn(
                "relative flex-1 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium transition",
                "data-[state=active]:border-cyan-500/80 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-200",
                "data-[state=inactive]:bg-slate-900/40 data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-800/60",
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span>{item.label}</span>
                <span className="text-xs uppercase tracking-widest text-slate-500">{item.shortcut}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        <motion.div
          key={active.id}
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 120 }}
          className="rounded-3xl border border-slate-800/60 bg-slate-950/80 p-6 shadow-2xl shadow-black/30"
        >
          {active.content}
        </motion.div>
      </UITabs>
      <Separator className="border-slate-800/80" />
    </div>
  );
}
