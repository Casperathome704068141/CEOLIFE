import { Suspense } from 'react';
import { CapitalTerminal } from '@/components/capital/capital-terminal';
import { getFinancialSnapshot } from '@/lib/api/finance'; // We will build this
import { Button } from '@/components/ui/button';
import { Home, Wifi, ShieldCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default async function CapitalPage() {
  // Parallel fetch: Get all accounts, portfolio data, and transaction backlog
  const data = await getFinancialSnapshot(); 

  return (
    <div className="flex h-screen w-full flex-col bg-[#050505] text-slate-100 overflow-hidden font-mono">
      
      {/* LEVEL 1: HARDWARE HUD HEADER */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 select-none">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/30">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-slate-500 font-bold uppercase">
            <span className="text-emerald-500 animate-pulse">●</span> Capital Control
          </div>
        </div>

        <div className="flex items-center gap-6">
           {/* Ticker Tape */}
           <div className="flex gap-6 text-[10px] font-medium">
              <span className="text-slate-400">NET WORTH</span>
              <span className="text-white font-mono text-xs tracking-wide">$1,240,500.00</span>
              <span className="text-emerald-400">▲ 1.4% (24h)</span>
           </div>
           
           <div className="flex items-center gap-3 text-slate-600">
              <Wifi className="h-3 w-3" />
              <ShieldCheck className="h-3 w-3" />
           </div>
        </div>
      </header>

      {/* LEVEL 2: THE TERMINAL */}
      <main className="flex-1 relative">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-5 w-5 text-cyan-500 animate-spin" />
              <span className="text-[10px] text-cyan-700 tracking-widest">ESTABLISHING SECURE UPLINK...</span>
            </div>
          </div>
        }>
          <CapitalTerminal initialData={data} />
        </Suspense>
      </main>
    </div>
  );
}
