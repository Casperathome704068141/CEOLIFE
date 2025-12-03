import { Suspense } from 'react';
import { MorningBrief } from '@/components/dashboard/morning-brief';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { getFeed } from '@/lib/api/feed';

export default async function MissionControl() {
  const feed = await getFeed();

  return (
    <div className="min-h-screen w-full bg-[#020203] text-slate-100 flex justify-center">
      <div className="w-full max-w-3xl px-6 py-12 space-y-8">
        {/* 1. GREETING & STATUS */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Good Morning, Casper.</h1>
            <p className="text-slate-400 mt-1">System nominal. 3 urgent items in queue.</p>
          </div>
          <div className="flex gap-2">
            {/* Unified Life Score Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-400">ULS: 842</span>
            </div>
          </div>
        </div>

        {/* 2. QUICK INPUT (The Command Line) */}
        <QuickActions />

        {/* 3. THE FEED (Smart Stream) */}
        <div className="space-y-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-600">Priority Stream</h2>
          <Suspense fallback={<div>Loading stream...</div>}>
            <MorningBrief initialFeed={feed} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
