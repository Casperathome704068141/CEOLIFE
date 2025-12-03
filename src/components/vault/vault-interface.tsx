'use client';

import { useState, useMemo } from 'react';
import { Search, FileText, Eye, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VaultDoc = {
  id: string;
  name: string;
  date: string;
  tags: string[];
  size: string;
};

export type VaultUsage = {
  percent: number;
};

export function VaultInterface({ initialDocs, usage }: { initialDocs: VaultDoc[]; usage: VaultUsage }) {
  const [query, setQuery] = useState('');

  const filteredDocs = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return initialDocs;
    return initialDocs.filter((doc) =>
      [doc.name, doc.date, doc.size, doc.tags.join(' ')].some((field) => field.toLowerCase().includes(q)),
    );
  }, [initialDocs, query]);

  return (
    <div className="grid grid-cols-12 h-full divide-x divide-slate-800">
      {/* ZONE 1: SMART FILTERS (Col 1-2) */}
      <aside className="col-span-12 md:col-span-2 bg-[#080808] flex flex-col p-2 gap-1 border-r border-slate-900">
        <div className="mb-4 px-2 pt-3">
          <h2 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">Smart Contexts</h2>
        </div>
        {['All Documents', 'Needs Review', 'Tax 2024', 'Identity', 'Medical', 'Legal'].map((filter, i) => (
          <button
            key={filter}
            className={cn(
              'text-left px-3 py-2 rounded text-[11px] font-medium transition-all',
              i === 0 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200',
            )}
          >
            {filter}
          </button>
        ))}

        <div className="mt-auto p-3 rounded border border-slate-800 bg-slate-900/40">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Storage</span>
            <span>{usage.percent}%</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${usage.percent}%` }} />
          </div>
        </div>
      </aside>

      {/* ZONE 2: THE ARCHIVE (Col 3-8) */}
      <section className="col-span-12 md:col-span-6 bg-[#050505] flex flex-col">
        {/* Search Bar */}
        <div className="h-14 border-b border-slate-800 flex items-center px-4 gap-3">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            className="bg-transparent border-none focus:ring-0 w-full text-sm text-white placeholder:text-slate-600"
            placeholder="Search contents, OCR data, or dates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-[10px] uppercase text-slate-500 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Smart Tags</th>
                <th className="px-4 py-3 font-medium text-right">Size</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-300 divide-y divide-slate-900">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="group hover:bg-indigo-950/10 cursor-pointer transition-colors">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span className="group-hover:text-white font-medium">{doc.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{doc.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {doc.tags.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">{doc.size}</td>
                </tr>
              ))}
              {!filteredDocs.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-600 text-xs">
                    No documents found for "{query}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ZONE 3: INSPECTOR & AI (Col 9-12) */}
      <aside className="col-span-12 md:col-span-4 bg-[#080808] border-l border-slate-800 flex flex-col p-6">
        <div className="aspect-[3/4] bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center mb-6 relative overflow-hidden group">
          {/* Preview Placeholder */}
          <FileText className="h-16 w-16 text-slate-700" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all">
            <button className="p-2 rounded-full bg-white text-black hover:scale-110 transition">
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full bg-slate-800 text-white border border-slate-600 hover:bg-slate-700">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-2">AI Extraction</h3>
            <div className="p-3 rounded bg-indigo-950/20 border border-indigo-500/20 text-indigo-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-indigo-400">Detected Date:</span>
                <span>Oct 24, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-400">Amount:</span>
                <span>$1,240.00</span>
              </div>
              <button className="w-full mt-2 py-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 rounded text-white font-bold uppercase">
                Create Transaction
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
