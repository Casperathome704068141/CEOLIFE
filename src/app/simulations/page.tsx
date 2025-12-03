'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, SlidersHorizontal } from 'lucide-react';

const variables = [
  { key: 'inflation', label: 'Inflation', defaultValue: 3.5 },
  { key: 'market', label: 'Market Return', defaultValue: 6.2 },
  { key: 'spending', label: 'Annual Spending', defaultValue: 4.1 },
  { key: 'savings', label: 'Savings Rate', defaultValue: 18.4 },
];

export default function SimulationsPage() {
  const [shockEvents] = useState([
    { label: '⚠ Market Crash (-20%)', variant: 'risk' },
    { label: '+ Add Shock Event', variant: 'neutral' },
  ]);

  const [controls, setControls] = useState(() =>
    variables.reduce<Record<string, number>>((acc, variable) => {
      acc[variable.key] = variable.defaultValue;
      return acc;
    }, {}),
  );

  const successRate = useMemo(() => {
    const baseline = 94.2;
    const volatility = controls.inflation * 0.1 - controls.market * 0.05;
    return Math.max(0, Math.min(100, baseline - volatility)).toFixed(1);
  }, [controls]);

  return (
    <div className="h-screen bg-[#050505] text-slate-100 p-6 grid grid-cols-12 gap-6 overflow-hidden font-mono">
      {/* Sidebar: Control Variables */}
      <div className="col-span-12 lg:col-span-3 space-y-6 border-r border-slate-800 pr-0 lg:pr-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Variables</h2>
          <div className="space-y-4">
            {variables.map((variable) => (
              <div key={variable.key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{variable.label}</span>
                  <span>{controls[variable.key].toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.1}
                  value={controls[variable.key]}
                  onChange={(e) => setControls((prev) => ({ ...prev, [variable.key]: Number(e.target.value) }))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Shock Events</h2>
          <div className="space-y-2">
            {shockEvents.map((event, index) => (
              <button
                key={`${event.label}-${index}`}
                className={`w-full p-3 text-left text-xs rounded transition border ${
                  event.variant === 'risk'
                    ? 'bg-rose-950/20 border-rose-900/50 hover:border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                {event.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stage: The Outcome Cone */}
      <div className="col-span-12 lg:col-span-9 flex flex-col">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3 text-slate-500 text-xs uppercase tracking-widest">
            <SlidersHorizontal className="h-4 w-4" /> Outcome Cones
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <AlertTriangle className="h-4 w-4 text-amber-400" /> Monte Carlo x10k paths
          </div>
        </div>
        <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/20 relative p-6">
          <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm">
            [Visualization Engine]
          </div>
        </div>
        <div className="h-32 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] uppercase text-slate-500">Success Probability</div>
            <div className="text-2xl font-mono text-emerald-400">{successRate}%</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] uppercase text-slate-500">Worst Case (P10)</div>
            <div className="text-xl font-mono text-rose-400">-$420k</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] uppercase text-slate-500">Best Case (P90)</div>
            <div className="text-xl font-mono text-indigo-300">+$1.2M</div>
          </div>
        </div>
      </div>
    </div>
  );
}
