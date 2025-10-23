"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, CalendarClock, Link2, Folder, Trash2, Tag } from "lucide-react";

interface BulkBarProps {
  visible: boolean;
  count: number;
  onClear: () => void;
  onShare: () => void;
  onMove: () => void;
  onDelete: () => void;
  onLink: () => void;
  onSetExpiry: () => void;
  onAddTag: (tag: string) => void;
}

export function BulkBar({
  visible,
  count,
  onClear,
  onShare,
  onMove,
  onDelete,
  onLink,
  onSetExpiry,
  onAddTag,
}: BulkBarProps) {
  const [tag, setTag] = useState("");

  const applyTag = () => {
    if (!tag.trim()) return;
    onAddTag(tag.trim());
    setTag("");
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          className="fixed inset-x-6 bottom-6 z-50 rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Bulk actions</p>
              <p className="text-xs text-slate-400">{count} item(s) selected</p>
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Button variant="secondary" className="rounded-2xl" onClick={onShare}>
                <Users className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button variant="secondary" className="rounded-2xl" onClick={onMove}>
                <Folder className="mr-2 h-4 w-4" /> Move
              </Button>
              <Button variant="secondary" className="rounded-2xl" onClick={onLink}>
                <Link2 className="mr-2 h-4 w-4" /> Link
              </Button>
              <Button variant="secondary" className="rounded-2xl" onClick={onSetExpiry}>
                <CalendarClock className="mr-2 h-4 w-4" /> Set expiry
              </Button>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/40 px-3 py-2">
                <Tag className="h-4 w-4 text-cyan-300" />
                <Input
                  value={tag}
                  onChange={(event) => setTag(event.target.value)}
                  placeholder="Add tag"
                  className="h-8 w-28 rounded-xl bg-transparent text-xs"
                />
                <Button size="sm" className="rounded-xl" onClick={applyTag}>
                  Apply
                </Button>
              </div>
              <Button variant="destructive" className="rounded-2xl" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
            <Button variant="ghost" className="rounded-2xl text-slate-400" onClick={onClear}>
              Clear selection
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
