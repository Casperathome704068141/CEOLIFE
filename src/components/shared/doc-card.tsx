"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface DocCardProps {
  name: string;
  type: string;
  updatedAt: string;
  icon: string;
  tags?: string[];
}

export function DocCard({ name, type, updatedAt, icon, tags = [] }: DocCardProps) {
  const Icon = (LucideIcons as any)[icon] || LucideIcons.File;
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/70 p-4">
        <CardContent className="space-y-4 p-0">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
              <Icon className="h-5 w-5" />
            </div>
            <Badge className="rounded-full bg-slate-900/80 text-xs uppercase tracking-wide text-slate-300">
              {type}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-white">{name}</p>
            <p className="text-xs text-slate-400">Updated {updatedAt}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full border-cyan-500/50 text-cyan-200">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
