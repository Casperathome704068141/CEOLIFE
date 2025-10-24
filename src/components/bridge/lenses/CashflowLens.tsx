"use client";

import { CashflowInsight } from "@/lib/graph/types";
import { formatCurrency, formatRelative } from "@/lib/ui/format";

type Props = {
  variance: number;
  burnRate: number;
  transactions: CashflowInsight[];
};

export function CashflowLens({ variance, burnRate, transactions }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Variance</span>
          <span className={variance > 0 ? "text-amber-300" : "text-emerald-300"}>{variance.toFixed(1)}%</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
          <span>Burn rate</span>
          <span className="text-cyan-200">{formatCurrency(burnRate)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {transactions.map(txn => (
          <div key={txn.id} className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{formatCurrency(txn.amount)}</p>
                <p className="text-xs text-slate-400">{txn.category}</p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p>{formatRelative(txn.postedAt)}</p>
                <p className="capitalize text-slate-500">{txn.status}</p>
              </div>
            </div>
            {txn.memo && <p className="mt-3 text-xs text-slate-300">{txn.memo}</p>}
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800/80 p-6 text-center text-sm text-slate-400">
            No cashflow entries to display.
          </div>
        )}
      </div>
    </div>
  );
}

