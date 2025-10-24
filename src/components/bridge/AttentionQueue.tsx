"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QueueItem as QueueItemType } from "@/lib/graph/types";
import { QueueItem } from "./QueueItem";

const filters = [
  { value: "all", label: "All" },
  { value: "finance", label: "Finance" },
  { value: "care", label: "Care" },
  { value: "home", label: "Home" },
  { value: "goals", label: "Goals" },
  { value: "pulse", label: "Pulse" },
];

type Props = {
  items: QueueItemType[];
  filter: string;
  onFilterChange: (filter: string) => void;
  selectedId?: string | null;
  onSelect: (item: QueueItemType) => void;
  onAction: (action: QueueItemType["actions"][number], item: QueueItemType) => void;
  focusMode?: boolean;
};

export function AttentionQueue({
  items,
  filter,
  onFilterChange,
  selectedId,
  onSelect,
  onAction,
  focusMode = false,
}: Props) {
  const visibleItems = useMemo(() => {
    const next = filter === "all" ? items : items.filter(item => item.category === filter);
    return focusMode ? next.slice(0, 5) : next;
  }, [items, filter, focusMode]);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-900/70 bg-slate-950/80 p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">Attention Queue</p>
          <h2 className="text-2xl font-semibold text-white">What needs you now</h2>
        </div>
      </div>
      <Tabs value={filter} onValueChange={onFilterChange} className="w-full">
        <TabsList className="grid grid-cols-3 gap-2 bg-slate-900/60">
          {filters.map(option => (
            <TabsTrigger key={option.value} value={option.value} className="rounded-full">
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ScrollArea className="mt-4 h-[calc(100%-6rem)] pr-2">
        <AnimatePresence>
          <motion.div layout className="flex flex-col gap-3">
            {visibleItems.map(item => (
              <QueueItem
                key={item.id}
                item={item}
                isSelected={item.id === selectedId}
                onSelect={() => onSelect(item)}
                onAction={onAction}
              />
            ))}
            {visibleItems.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-800/80 p-6 text-center text-sm text-slate-400">
                Nothing urgent. Enjoy the calm.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}

