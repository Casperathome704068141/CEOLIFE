import { Suspense } from "react";
import Link from "next/link";
import { Home, ShieldCheck, Wifi } from "lucide-react";
import { CapitalTerminal } from "@/components/capital/capital-terminal";
import { Button } from "@/components/ui/button";
import { getCashflowData, getPortfolioData } from "@/lib/api/finance";

export default async function FinanceOverviewPage() {
  const [portfolio, cashflow] = await Promise.all([getPortfolioData(), getCashflowData()]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0B0C10] font-mono text-slate-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-amber-500/30 bg-amber-500/10 text-[10px] font-bold uppercase tracking-widest text-amber-500 transition-all hover:bg-amber-500/20"
            >
              <Home className="h-3 w-3" /> Mission Control
            </Button>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-500">●</span> SYSTEM OPTIMAL
            <span className="ml-2 text-[10px] text-slate-600">latency: 12ms</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-[10px] uppercase tracking-wider">
            <span className="text-slate-500">Global Net Worth:</span>
            <span className="text-sm font-bold text-white">$1,240,420.50</span>
            <span className="text-emerald-400">▲ $4,230 (24h)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Wifi className="h-3 w-3" />
            <ShieldCheck className="h-3 w-3" />
          </div>
        </div>
      </header>

      <main className="relative flex-1">
        <Suspense fallback={<div className="animate-pulse p-10 text-center text-xs">Initializing Financial Core...</div>}>
          <CapitalTerminal initialPortfolio={portfolio} initialCashflow={cashflow} />
        </Suspense>
      </main>
    </div>
  );
}
