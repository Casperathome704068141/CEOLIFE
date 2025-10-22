"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export interface StatTileProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  onClick?: () => void;
}

export function StatTile({ title, value, icon, delta, trend = "neutral", onClick }: StatTileProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="h-full"
    >
      <Card
        className="h-full cursor-pointer overflow-hidden rounded-3xl border border-slate-900/60 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 shadow-xl shadow-cyan-900/20"
        onClick={onClick}
      >
        <CardContent className="flex h-full flex-col justify-between gap-3 p-6">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-slate-400">
            <span>{title}</span>
            {icon}
          </div>
          <div>
            <div className="text-3xl font-headline font-semibold text-white">{value}</div>
            {delta ? (
              <div
                className={`mt-1 text-xs font-medium ${
                  trend === "up"
                    ? "text-emerald-400"
                    : trend === "down"
                    ? "text-rose-400"
                    : "text-slate-400"
                }`}
              >
                {delta}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
