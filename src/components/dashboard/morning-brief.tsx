'use client';

import { Calendar, DollarSign, Activity, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { FeedItem } from '@/lib/api/feed';

const typeMeta: Record<FeedItem['type'], { icon: JSX.Element; accent: string; hover: string }> = {
  finance: {
    icon: <DollarSign className="h-4 w-4" />,
    accent: 'text-amber-500 bg-amber-500/10 border-amber-500/40 hover:border-amber-500/70',
    hover: 'hover:border-amber-500/50',
  },
  calendar: {
    icon: <Calendar className="h-4 w-4" />,
    accent: 'text-blue-400 bg-blue-500/10 border-blue-500/40 hover:border-blue-500/70',
    hover: 'hover:border-blue-500/50',
  },
  task: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-500/70',
    hover: 'hover:border-emerald-500/50',
  },
  health: {
    icon: <Activity className="h-4 w-4" />,
    accent: 'text-rose-400 bg-rose-500/10 border-rose-500/40 hover:border-rose-500/70',
    hover: 'hover:border-rose-500/50',
  },
  alert: {
    icon: <AlertTriangle className="h-4 w-4" />,
    accent: 'text-slate-300 bg-slate-500/10 border-slate-500/40 hover:border-slate-500/70',
    hover: 'hover:border-slate-500/50',
  },
};

export function MorningBrief({ initialFeed }: { initialFeed: FeedItem[] }) {
  return (
    <div className="space-y-3">
      {initialFeed.map((item) => {
        const meta = typeMeta[item.type];
        return (
          <div
            key={item.id}
            className={`group flex gap-4 p-4 rounded-xl bg-[#0A0A0A] border border-slate-800 transition-all cursor-pointer ${meta.hover}`}
          >
            <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${meta.accent}`}>
              {meta.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="text-sm font-semibold text-slate-200">{item.title}</h3>
                <span className="text-[10px] text-slate-500">{item.timestamp}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{item.detail}</p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.action ? (
                <button className="text-[10px] px-3 py-1 rounded border border-slate-800 bg-slate-900 text-slate-300 hover:border-indigo-500/50">
                  {item.action}
                </button>
              ) : null}
              <ArrowRight className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
