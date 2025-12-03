"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRightLeft,
  ArrowUpRight,
  DollarSign,
  PieChart,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AssetType = "crypto" | "stock" | "cash" | "real_estate";
export type Asset = {
  symbol: string;
  name: string;
  type: AssetType;
  balance: number;
  price: number;
  delta24h: number;
  allocation: number;
};

type CapitalTerminalProps = {
  initialPortfolio: Asset[];
  initialCashflow: { burnRate: number; runwayDays: number; bills: Array<{ id: string; label: string; amount: number }> };
};

export function CapitalTerminal({ initialPortfolio, initialCashflow }: CapitalTerminalProps) {
  const [activeSector, setActiveSector] = useState<"overview" | "crypto" | "stocks" | "real_estate">("overview");

  const safePortfolio = Array.isArray(initialPortfolio) ? initialPortfolio : [];

  const assets: Asset[] = safePortfolio.length
    ? safePortfolio
    : [
        { symbol: "BTC", name: "Bitcoin", type: "crypto", balance: 1.24, price: 64200, delta24h: 2.4, allocation: 45 },
        { symbol: "ETH", name: "Ethereum", type: "crypto", balance: 14.5, price: 3400, delta24h: -1.2, allocation: 25 },
        { symbol: "NVDA", name: "NVIDIA", type: "stock", balance: 50, price: 920, delta24h: 5.1, allocation: 20 },
        { symbol: "USD", name: "Liquidity", type: "cash", balance: 14000, price: 1, delta24h: 0, allocation: 10 },
      ];

  const cashflow = initialCashflow ?? {
    burnRate: 4250,
    runwayDays: 128,
    bills: [
      { id: "bill-aws", label: "AWS Services", amount: -64 },
      { id: "bill-rent", label: "Launchpad Lease", amount: -1800 },
      { id: "bill-card", label: "Amex Auto-pay", amount: -940 },
    ],
  };

  const filteredAssets = assets.filter((asset) => (activeSector === "overview" ? true : asset.type === activeSector));

  return (
    <div className="grid h-full grid-cols-12 divide-x divide-slate-800 bg-[#050505]">
      <div className="col-span-3 flex flex-col bg-slate-950/50">
        <div className="border-b border-slate-800 p-4">
          <h2 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <Wallet className="h-3 w-3" /> Operational Fuel
          </h2>

          <div className="relative mb-6 rounded-xl border border-slate-800 bg-slate-900/20 py-4 text-center">
            <span className="absolute left-3 top-2 text-[10px] uppercase text-slate-400">Monthly Burn</span>
            <div className="text-3xl font-mono text-white">${cashflow.burnRate.toLocaleString()}</div>
            <div className="mt-1 text-xs text-rose-400">▲ 12% vs Target</div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <button className="flex h-8 items-center justify-center gap-2 rounded border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold uppercase text-emerald-400 transition hover:bg-emerald-500/20">
              <ArrowDownRight className="h-3 w-3" /> Deposit
            </button>
            <button className="flex h-8 items-center justify-center gap-2 rounded border border-rose-500/30 bg-rose-500/10 text-[10px] font-bold uppercase text-rose-400 transition hover:bg-rose-500/20">
              <ArrowUpRight className="h-3 w-3" /> Transfer
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {cashflow.bills.map((bill) => (
            <div
              key={bill.id}
              className="group flex cursor-pointer items-center justify-between rounded p-2 hover:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-600 transition-colors group-hover:bg-white" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-300">{bill.label}</span>
                  <span className="text-[10px] text-slate-500">Infrastructure</span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-300">{bill.amount > 0 ? "+" : ""}${bill.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-6 flex flex-col bg-[#080808]">
        <div className="flex h-12 items-center justify-between border-b border-slate-800 px-4">
          <div className="flex gap-1 rounded-lg bg-slate-900/50 p-1">
            {["Overview", "Crypto", "Stocks", "Real Estate"].map((tab) => {
              const tabValue = tab.toLowerCase() as typeof activeSector;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveSector(tabValue)}
                  className={cn(
                    "px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded transition-all",
                    activeSector === tabValue
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-300",
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <RefreshCw className="h-3 w-3 cursor-pointer transition-all duration-700 hover:rotate-180 hover:text-white" />
            <ArrowRightLeft className="h-3 w-3" />
            <ShieldCheck className="h-3 w-3" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 grid grid-cols-2 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.symbol}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30 p-4 transition-all hover:border-slate-600"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white",
                        asset.type === "crypto" ? "bg-orange-500" : asset.type === "stock" ? "bg-blue-600" : "bg-emerald-600",
                      )}
                    >
                      {asset.symbol.substring(0, 1)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{asset.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">
                        {asset.balance} {asset.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-white">${(asset.balance * asset.price).toLocaleString()}</div>
                    <div
                      className={cn(
                        "text-[10px] font-bold",
                        asset.delta24h >= 0 ? "text-emerald-500" : "text-rose-500",
                      )}
                    >
                      {asset.delta24h > 0 ? "+" : ""}
                      {asset.delta24h}%
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-[10px] text-slate-500">
                    <span>Allocation Target</span>
                    <span>{asset.allocation}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        asset.type === "crypto" ? "bg-orange-500" : asset.type === "stock" ? "bg-blue-500" : "bg-emerald-500",
                      )}
                      style={{ width: `${asset.allocation}%` }}
                    />
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <button className="rounded border border-slate-600 bg-slate-900 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800">
                    TRADE
                  </button>
                  <button className="rounded border border-slate-600 bg-slate-900 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800">
                    DETAILS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-3 flex flex-col border-l border-slate-800 bg-slate-950/50">
        <div className="border-b border-slate-800 bg-slate-900/10 p-4">
          <h2 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <TrendingUp className="h-3 w-3" /> Trajectory
          </h2>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Current market volatility suggests a <strong>65% chance</strong> of hitting your $2M Net Worth goal by Q3 2026.
          </p>
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <Activity className="h-3 w-3" /> Optimization Available
            </div>
            <p className="mb-3 text-xs text-slate-300">
              Your "Emergency Fund" goal is 110% funded. Consider sweeping <strong>$4,000</strong> into BTC while it is down 1.2%.
            </p>
            <button className="w-full rounded border border-emerald-500/20 bg-emerald-500/10 py-1.5 text-[10px] font-bold uppercase text-emerald-400 transition hover:bg-emerald-500/20">
              Execute Sweep
            </button>
          </div>

          <div className="rounded-lg border border-dashed border-slate-700 p-3 opacity-70 transition-opacity hover:opacity-100">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Runway Simulator</span>
              <PieChart className="h-3 w-3 text-slate-500" />
            </div>
            <div className="mb-2 text-[10px] text-slate-500">Stress test your portfolio against a 20% market crash.</div>
            <Link href="/simulations">
              <button className="text-[10px] text-blue-400 underline underline-offset-4 transition hover:text-blue-300">
                Run Scenario →
              </button>
            </Link>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <DollarSign className="h-3 w-3" /> Liquidity Telemetry
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Runway</span>
              <span className="font-mono text-emerald-400">{cashflow.runwayDays} days</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Next Bill</span>
              <span className="font-mono text-amber-300">T-36h</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Utilization</span>
              <span className="font-mono text-sky-300">41%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
