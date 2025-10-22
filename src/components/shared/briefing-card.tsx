"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export interface BriefingInsight {
  id: string;
  title: string;
  detail: string;
  actionLabel?: string;
}

interface BriefingCardProps {
  insights: BriefingInsight[];
  onExpand?: () => void;
  onRunSimulation?: () => void;
  onCreateRule?: () => void;
}

export function BriefingCard({ insights, onExpand, onRunSimulation, onCreateRule }: BriefingCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="h-full rounded-3xl border border-slate-900/60 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 shadow-2xl shadow-cyan-900/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">Beno’s briefing</CardTitle>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onExpand}>
            <ArrowUpRight className="h-4 w-4" />
            <span className="sr-only">Expand briefing</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            {insights.map((insight) => (
              <li
                key={insight.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4"
              >
                <p className="text-sm font-medium text-white">{insight.title}</p>
                <p className="text-xs text-slate-300">{insight.detail}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" className="rounded-2xl bg-cyan-500/20 text-cyan-200" onClick={onRunSimulation}>
              Run simulation
            </Button>
            <Button variant="secondary" className="rounded-2xl bg-indigo-500/20 text-indigo-200" onClick={onCreateRule}>
              Create automation
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
