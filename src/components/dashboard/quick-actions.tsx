'use client';

import { useState } from 'react';
import { Command, Keyboard, Sparkles } from 'lucide-react';

export function QuickActions() {
  const [input, setInput] = useState('');
  const suggestions = [
    'Log: Paid Amex $1,240',
    'Create: 90m Deep Work block at 1pm',
    'Remind me: Renew insurance before Nov 24',
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0A0A0A] p-4 shadow-inner">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-slate-600 mb-2">
        <Command className="h-4 w-4" /> Command Line
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#050505] px-4 py-3">
        <Sparkles className="h-4 w-4 text-indigo-400" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type an intent: 'Schedule deep work at 2pm'"
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
        />
        <button className="text-[11px] uppercase tracking-widest rounded border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-indigo-200 hover:bg-indigo-500/20">
          Deploy
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
        {suggestions.map((item) => (
          <button
            key={item}
            onClick={() => setInput(item)}
            className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 hover:border-indigo-500/50 hover:text-indigo-200 transition"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-slate-600">
        <Keyboard className="h-3 w-3" /> J / K to scroll • Enter to execute
      </div>
    </div>
  );
}
