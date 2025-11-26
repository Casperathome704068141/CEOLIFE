import { FinanceTerminal } from '@/components/finance/finance-terminal';

export default function FinanceOverviewPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Capital Engine</p>
          <h1 className="text-2xl font-semibold text-white">Financial Terminal</h1>
          <p className="text-sm text-slate-400">High-density control center for inflows, tanks, and outflows.</p>
        </div>
        <div className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs text-slate-200">
          Review Mode engaged · Drag from tanks to redirect capital
        </div>
      </div>
      <FinanceTerminal />
    </div>
  );
}
