'use client';

import { useState } from 'react';
import { 
  ResizableHandle, ResizablePanel, ResizablePanelGroup 
} from "@/components/ui/resizable";
import { 
  ArrowRightLeft, TrendingUp, Wallet, 
  AlertCircle, Check, Search, DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CashflowData, Asset as PortfolioAsset } from '@/lib/api/finance';

// --- MOCK TYPES FOR CONTEXT ---
type Transaction = { id: string; merchant: string; amount: number; date: string; category: string; status: 'posted' | 'pending' };
type Asset = { symbol: string; name: string; balance: number; price: number; allocation: number; type: 'crypto' | 'stock' | 'cash' };

export function CapitalTerminal({ initialPortfolio, initialCashflow }: { initialPortfolio: PortfolioAsset[], initialCashflow: CashflowData }) {
  const [activeTx, setActiveTx] = useState<string | null>(null);

  const transactions: Transaction[] = initialCashflow?.transactions ?? [];
  const assets: Asset[] = initialPortfolio ?? [];
  const monthlyBurn = initialCashflow?.monthlyBurn ?? 0;
  const burnTarget = initialCashflow?.burnTarget ?? 6000;


  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full border-t border-slate-800">
      
      {/* =====================================================================================
          PANE 1: LIQUIDITY & BURN (The Inbox)
          Purpose: Process cashflow. Approve expenses. Monitor runway.
      ===================================================================================== */}
      <ResizablePanel defaultSize={25} minSize={20} className="bg-[#080808] flex flex-col border-r border-slate-800">
        
        {/* BURN RATE METER */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/10">
           <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monthly Burn</span>
              <span className="text-[10px] text-rose-400">▲ 12% vs Avg</span>
           </div>
           <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono text-white font-light">${monthlyBurn.toLocaleString()}</span>
              <span className="text-xs text-slate-500">/ ${burnTarget.toLocaleString()}</span>
           </div>
           {/* Progress Bar */}
           <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500" style={{width: `${(monthlyBurn/burnTarget)*100}%`}} />
           </div>
        </div>

        {/* TRANSACTION FEED */}
        <div className="flex-1 overflow-y-auto">
           <div className="sticky top-0 z-10 bg-[#080808] p-2 border-b border-slate-800">
              <div className="relative">
                 <Search className="absolute left-2 top-2 h-3 w-3 text-slate-600" />
                 <input 
                   className="w-full bg-slate-900/50 border border-slate-800 rounded-md py-1.5 pl-7 pr-2 text-[10px] text-slate-300 focus:outline-none focus:border-slate-600"
                   placeholder="Filter ledger..."
                 />
              </div>
           </div>

           <div className="divide-y divide-slate-900">
              {transactions.map((tx) => (
                 <div 
                    key={tx.id}
                    onClick={() => setActiveTx(tx.id)}
                    className={cn(
                       "group flex items-center justify-between p-3 cursor-pointer transition-all hover:bg-slate-900",
                       activeTx === tx.id ? "bg-slate-900 border-l-2 border-cyan-500 pl-[10px]" : "pl-3 border-l-2 border-transparent"
                    )}
                 >
                    <div className="flex items-center gap-3">
                       <div className={cn(
                          "h-2 w-2 rounded-full",
                          tx.amount > 0 ? "bg-emerald-500" : "bg-amber-500"
                       )} />
                       <div className="flex flex-col">
                          <span className={cn("text-xs font-medium", activeTx === tx.id ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>
                             {tx.merchant}
                          </span>
                          <span className="text-[10px] text-slate-600">{tx.date} · {tx.category}</span>
                       </div>
                    </div>
                    <span className={cn("font-mono text-xs", tx.amount > 0 ? "text-emerald-400" : "text-slate-300")}>
                       {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                 </div>
              ))}
           </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="p-3 border-t border-slate-800 grid grid-cols-2 gap-2">
           <button className="flex items-center justify-center gap-2 h-8 rounded bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 text-[10px] font-bold uppercase hover:bg-emerald-900/40 transition">
              <Check className="h-3 w-3" /> Approve All
           </button>
           <button className="flex items-center justify-center gap-2 h-8 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold uppercase hover:bg-slate-700 transition">
              <ArrowRightLeft className="h-3 w-3" /> Transfer
           </button>
        </div>
      </ResizablePanel>
      
      <ResizableHandle className="bg-slate-800 hover:bg-cyan-500 w-[1px] transition-colors" />

      {/* =====================================================================================
          PANE 2: ASSET MATRIX (The Portfolio)
          Purpose: Visual allocation. Rebalancing. Deep dive into holdings.
      ===================================================================================== */}
      <ResizablePanel defaultSize={50} className="bg-[#050505] flex flex-col">
         <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4">
            <div className="flex gap-2">
               {['Overview', 'Crypto', 'Equities', 'Real Estate'].map(tab => (
                  <button key={tab} className="px-3 py-1 text-[10px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded transition">
                     {tab}
                  </button>
               ))}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">LIVE MARKET DATA ●</div>
         </div>

         <div className="flex-1 p-6 overflow-y-auto">
            {/* ASSET GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
               {assets.map((asset) => (
                  <motion.div 
                    key={asset.symbol}
                    layoutId={`asset-${asset.symbol}`}
                    className="group relative p-4 rounded-xl border border-slate-800 bg-slate-900/20 hover:border-slate-600 hover:bg-slate-900/40 transition-all cursor-pointer">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold",
                              asset.type === 'crypto' ? "bg-amber-500/10 text-amber-500" : 
                              asset.type === 'stock' ? "bg-blue-500/10 text-blue-500" : 
                              "bg-emerald-500/10 text-emerald-500"
                           )}>
                              {asset.symbol}
                           </div>
                           <div>
                              <div className="text-xs font-bold text-white">{asset.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{asset.balance} UNITS</div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="space-y-1">
                        <div className="text-lg font-mono text-slate-200">${(asset.price * asset.balance).toLocaleString()}</div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] text-slate-500">Allocation</span>
                           <span className="text-[10px] text-cyan-400">{asset.allocation}%</span>
                        </div>
                        {/* Allocation Bar */}
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-cyan-500" style={{width: `${asset.allocation}%`}} />
                        </div>
                     </div>

                     {/* Hover Action Overlay */}
                     <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                        <button className="h-7 px-3 rounded bg-cyan-600 text-white text-[10px] font-bold uppercase hover:bg-cyan-500">Buy</button>
                        <button className="h-7 px-3 rounded bg-slate-700 text-white text-[10px] font-bold uppercase hover:bg-slate-600">Sell</button>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </ResizablePanel>

      <ResizableHandle className="bg-slate-800 hover:bg-cyan-500 w-[1px] transition-colors" />

      {/* =====================================================================================
          PANE 3: TRAJECTORY (The Future)
          Purpose: Forecasts. "Time Travel". Runway simulation.
      ===================================================================================== */}
      <ResizablePanel defaultSize={25} minSize={20} className="bg-[#080808] flex flex-col border-l border-slate-800">
         <div className="p-5 border-b border-slate-800">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <TrendingUp className="h-3 w-3" /> Future Cast
            </h2>

            {/* RUNWAY PREDICTION */}
            <div className="relative h-32 w-full border border-dashed border-slate-800 rounded-lg bg-slate-900/20 mb-4 overflow-hidden">
               {/* Mock Chart Line */}
               <svg className="absolute inset-0 h-full w-full p-2" viewBox="0 0 100 50" preserveAspectRatio="none">
                  <path d="M0,40 Q25,35 50,25 T100,10" fill="none" stroke="#10b981" strokeWidth="2" />
                  <path d="M0,40 Q25,35 50,25 T100,10 V50 H0 Z" fill="url(#grad1)" opacity="0.2" />
                  <defs>
                     <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#10b981", stopOpacity: 0 }} />
                     </linearGradient>
                  </defs>
               </svg>
               <div className="absolute bottom-2 left-2 text-[9px] text-slate-500">TODAY</div>
               <div className="absolute bottom-2 right-2 text-[9px] text-slate-500">+90 DAYS</div>
            </div>

            <div className="flex justify-between items-center mb-2">
               <span className="text-[10px] text-slate-400">Projected Balance (+30d)</span>
               <span className="text-sm font-mono text-emerald-400">$18,240</span>
            </div>
            
            <div className="p-3 rounded bg-amber-950/20 border border-amber-900/50 flex gap-3">
               <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
               <div className="text-[10px] text-amber-200/80 leading-relaxed">
                  <strong>Liquidity Warning:</strong> Large tax payment ($4,500) due in 14 days. Projected cash balance will dip below threshold.
               </div>
            </div>
         </div>

         {/* UPCOMING BILLS LIST */}
         <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-[10px] font-bold text-slate-600 uppercase mb-3">Upcoming Liabilities</h3>
            <div className="space-y-2">
               {[
                  { name: 'Rent / Mortgage', amount: 2400, days: 4 },
                  { name: 'Car Insurance', amount: 140, days: 12 },
                  { name: 'Adobe CC', amount: 54, days: 15 },
               ].map((bill) => (
                  <div key={bill.name} className="flex justify-between items-center p-2 rounded hover:bg-slate-900/50">
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-300">{bill.name}</span>
                        <span className="text-[10px] text-slate-600">In {bill.days} days</span>
                     </div>
                     <span className="text-xs font-mono text-slate-400">-${bill.amount}</span>
                  </div>
               ))}
            </div>
         </div>
      </ResizablePanel>

    </ResizablePanelGroup>
  );
}
