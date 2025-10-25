
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings2, TrendingUp } from "lucide-react";

interface Props {
  onRefresh: () => void;
  onCustomize: () => void;
  onViewTrends: () => void;
}

export function HeaderBar({ onRefresh, onCustomize, onViewTrends }: Props) {
  return (
    <motion.header
      className="flex flex-col gap-6 rounded-2xl border border-border/60 bg-background/60 p-6 backdrop-blur"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Pulse</h1>
          <p className="text-sm text-muted-foreground">
            Sports, Odds, News & Weather in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" onClick={onCustomize} className="gap-2">
            <Settings2 className="h-4 w-4" /> Customize sources
          </Button>
          <Button variant="default" onClick={onViewTrends} className="gap-2">
            <TrendingUp className="h-4 w-4" /> View trends
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
