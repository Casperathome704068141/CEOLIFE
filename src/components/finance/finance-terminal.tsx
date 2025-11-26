"use client";

import React, { useState } from "react";
import { Download, Filter, MoreHorizontal, Plus, RefreshCw, Search } from "lucide-react";

const transactions = [
  { id: "tx_01", date: "Today, 09:41", merchant: "AWS Web Services", category: "Infrastructure", amount: -64.2, status: "posted", tag: "biz" },
  { id: "tx_02", date: "Yesterday", merchant: "Stripe Payout", category: "Income", amount: 1250.0, status: "cleared", tag: "income" },
  { id: "tx_03", date: "Yesterday", merchant: "Uber Eats", category: "Food", amount: -24.5, status: "pending", tag: "personal" },
  { id: "tx_04", date: "Nov 24", merchant: "Apple Store", category: "Tech", amount: -1299.0, status: "posted", tag: "asset" },
  { id: "tx_05", date: "Nov 23", merchant: "Hydro Bill", category: "Utilities", amount: -145.2, status: "posted", tag: "home" },
];

const accounts = [
  { name: "Main Checking", balance: 42000, type: "liquid", change: -2.4 },
  { name: "Business Vault", balance: 12500, type: "liquid", change: 12.5 },
  { name: "Inv. Portfolio", balance: 145000, type: "asset", change: 4.2 },
  { name: "Amex Platinum", balance: -1240, type: "credit", change: -0.5 },
];

export function FinanceTerminal() {
  const [viewMode, setViewMode] = useState<"all" | "income" | "expense">("all");

  const filteredTransactions = transactions.filter((tx) => {
    if (viewMode === "income") return tx.amount > 0;
    if (viewMode === "expense") return tx.amount < 0;
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-3xl border border-slate-900/70 bg-[#050505] text-gray-300 shadow-2xl">
      <div className="h-10 border-b border-[#27272A] bg-[#0A0A0A] px-4 text-xs font-mono text-slate-200">
        <div className="flex h-full items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <span className="text-gray-500">MARKETS //</span>
          <span className="mr-6 text-green-500">BTC $94,230 ▲ 1.2%</span>
          <span className="mr-6 text-red-500">ETH $3,400 ▼ 0.4%</span>
          <span className="mr-6 text-green-500">S&P 500 5,800 ▲ 0.1%</span>
          <span className="text-gray-500">LOCAL //</span>
          <span className="text-white">BURN RATE: $142/day</span>
          <span className="text-blue-400">RUNWAY: 128 Days</span>
        </div>
      </div>

      <div className="h-16 border-b border-[#27272A] bg-[#080808] px-6">
        <div className="flex h-full items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Finance Terminal</h1>
            <p className="text-xs text-gray-500">LEDGER INTEGRITY: 100%</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] uppercase text-gray-400">
            <button
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition ${
                viewMode === "all" ? "bg-blue-600 text-white" : "bg-[#18181B] text-gray-400"
              }`}
              onClick={() => setViewMode("all")}
            >
              All
            </button>
            <button
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition ${
                viewMode === "income" ? "bg-blue-600 text-white" : "bg-[#18181B] text-gray-400"
              }`}
              onClick={() => setViewMode("income")}
            >
              Income
            </button>
            <button
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition ${
                viewMode === "expense" ? "bg-blue-600 text-white" : "bg-[#18181B] text-gray-400"
              }`}
              onClick={() => setViewMode("expense")}
            >
              Expenses
            </button>
            <div className="flex items-center gap-3 pl-4">
              <button className="flex items-center gap-2 rounded border border-[#27272A] bg-[#18181B] px-3 py-1.5 text-xs transition hover:bg-[#27272A]">
                <RefreshCw size={14} /> SYNC BANK
              </button>
              <button className="flex items-center gap-2 rounded border border-blue-500 bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_0_10px_rgba(37,99,235,0.3)] transition hover:bg-blue-700">
                <Plus size={14} /> INJECT TRANSACTION
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-12 grid-rows-6 overflow-hidden">
        <div className="col-span-3 row-span-6 overflow-y-auto border-r border-[#27272A] bg-[#080808] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-gray-500">Liquidity Pools</h3>
            <MoreHorizontal size={14} className="text-gray-600" />
          </div>
          <div className="space-y-3">
            {accounts.map((acc) => (
              <div
                key={acc.name}
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-[#1F1F22] bg-[#0F0F10] p-3 transition hover:border-gray-600"
              >
                <div className="absolute right-0 top-0 h-full w-1 bg-blue-600 opacity-0 transition group-hover:opacity-100" />
                <div className="mb-1 text-xs text-gray-400">{acc.name}</div>
                <div className="mb-1 text-lg font-mono text-white">${acc.balance.toLocaleString()}</div>
                <div className={`flex items-center gap-1 text-[10px] ${acc.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {acc.change >= 0 ? "▲" : "▼"} {Math.abs(acc.change)}%<span className="text-gray-600">vs last week</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-dashed border-[#27272A] p-4 text-center">
            <div className="mb-2 text-[10px] text-gray-500">SAFE TO SPEND</div>
            <div className="text-2xl font-bold font-mono text-white">$1,240</div>
            <div className="mt-1 text-[10px] text-gray-600">After bills & savings</div>
          </div>
        </div>

        <div className="relative col-span-9 row-span-3 border-b border-[#27272A] bg-[#050505] p-6">
          <div className="absolute right-4 top-4 flex gap-2">
            {["1D", "1W", "1M", "YTD", "ALL"].map((t) => (
              <button
                key={t}
                className="rounded px-2 py-1 text-[10px] text-gray-500 transition hover:bg-[#27272A] hover:text-white"
              >
                {t}
              </button>
            ))}
          </div>
          <h3 className="mb-4 text-xs font-bold uppercase text-gray-500">Cashflow Velocity</h3>
          <div className="flex h-[80%] items-end justify-between border-b border-l border-[#27272A] px-4 pb-4">
            {[40, 65, 34, 78, 56, 90, 81, 45, 67, 88, 50, 70].map((h, i) => (
              <div
                key={i}
                className="group relative mx-1 w-full bg-gray-800 transition-all hover:bg-blue-500"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-[10px] opacity-0 transition group-hover:opacity-100">
                  ${h * 120}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-9 row-span-3 flex flex-col bg-[#050505]">
          <div className="flex h-12 items-center gap-4 border-b border-[#27272A] bg-[#080808] px-4">
            <div className="flex w-64 items-center gap-2 rounded border border-[#27272A] bg-[#121212] px-2 py-1">
              <Search size={12} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full bg-transparent text-xs text-white placeholder:text-gray-600 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-white">
                <Filter size={12} /> Filter
              </button>
              <button className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-white">
                <Download size={12} /> Export
              </button>
            </div>
            <div className="ml-auto flex items-center gap-2 text-[11px] font-semibold uppercase text-gray-400">
              <span className="rounded-full border border-[#27272A] px-2 py-1">Review Mode</span>
              <span className="rounded-full border border-[#27272A] px-2 py-1 text-amber-400">Uncategorized: 2</span>
            </div>
          </div>

          <div className="grid grid-cols-12 border-b border-[#27272A] px-6 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            <div className="col-span-2">Date</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2 text-center">Status</div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="group grid grid-cols-12 items-center border-b border-[#18181B] px-6 py-3 text-xs transition hover:bg-[#0F0F10]"
              >
                <div className="col-span-2 font-mono text-gray-400">{tx.date}</div>
                <div className="col-span-4 flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      tx.tag === "biz"
                        ? "bg-purple-500"
                        : tx.tag === "home"
                        ? "bg-orange-500"
                        : tx.tag === "income"
                        ? "bg-emerald-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <span className="font-medium text-white">{tx.merchant}</span>
                </div>
                <div className="col-span-2">
                  <span className="rounded-[4px] border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[10px] text-gray-400">
                    {tx.category}
                  </span>
                </div>
                <div className={`col-span-2 text-right font-mono ${tx.amount > 0 ? "text-green-500" : "text-white"}`}>
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount.toFixed(2)}
                </div>
                <div className="col-span-2 text-center">
                  {tx.status === "pending" ? (
                    <span className="flex items-center justify-center gap-1 text-[10px] text-orange-400">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" /> PENDING
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-600">CLEARED</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
