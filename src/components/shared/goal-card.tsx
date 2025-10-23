'use client';

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GoalCardProps {
  name: string;
  target: number;
  current: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  maskValues?: boolean;
}

export function GoalCard({ name, target, current, deadline, priority, maskValues = false }: GoalCardProps) {
  const progress = Math.min(100, Math.round((current / target) * 100));
  const priorityColor =
    priority === 'high' ? 'text-rose-300' : priority === 'medium' ? 'text-amber-300' : 'text-emerald-300';
  const formattedCurrent = `$${current.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`;
  const formattedTarget = `$${target.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`;
  const progressLabel = maskValues ? '•••• / ••••' : `${formattedCurrent} / ${formattedTarget}`;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}>
      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 p-4 shadow-xl">
        <CardHeader className="space-y-1 p-0 pb-4">
          <CardTitle className="text-base font-semibold text-white">{name}</CardTitle>
          <p className={`text-xs uppercase tracking-wide ${priorityColor}`}>Priority: {priority}</p>
        </CardHeader>
        <CardContent className="space-y-3 p-0">
          <div className="flex items-baseline justify-between text-sm text-slate-300">
            <span>Progress</span>
            <span>{progressLabel}</span>
          </div>
          <Progress value={progress} className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500" />
          </Progress>
          <div className="text-xs uppercase tracking-wide text-slate-400">Deadline {deadline}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
