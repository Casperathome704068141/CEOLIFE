import { Suspense } from 'react';
import Link from 'next/link';
import { ChronosInterface } from '@/components/chronos/chronos-interface';
import { getBacklog, getScheduleData } from '@/lib/api/chronos';
import { Button } from '@/components/ui/button';
import { Clock, Home, Zap } from 'lucide-react';

export default async function ChronosPage() {
  const [schedule, backlog] = await Promise.all([getScheduleData(), getBacklog()]);

  return (
    <div className="flex h-screen w-full flex-col bg-[#050505] text-slate-100 overflow-hidden font-mono">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-cyan-500/30 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 uppercase text-[10px] tracking-widest font-bold transition-all"
            >
              <Home className="h-3 w-3" /> Mission Control
            </Button>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
            <Clock className="h-3 w-3 text-cyan-500" />
            <span>T-MINUS 06:00 TO EOD</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900 px-4 py-1.5">
            <Zap className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 tracking-wider">ENERGY: NOMINAL</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-cyan-500 animate-pulse">INITIALIZING CHRONOS PROTOCOLS...</div>}>
          <ChronosInterface initialSchedule={schedule} initialBacklog={backlog} />
        </Suspense>
      </main>
    </div>
  );
}
