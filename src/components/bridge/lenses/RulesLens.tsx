"use client";

import { useState } from "react";
import { RuleSummary } from "@/lib/graph/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  rules: RuleSummary[];
};

export function RulesLens({ rules }: Props) {
  const [testing, setTesting] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {rules.map(rule => (
        <div key={rule.id} className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{rule.name}</p>
              <p className="text-xs text-slate-400">{rule.description}</p>
            </div>
            <Badge
              className={
                rule.status === "enabled"
                  ? "bg-emerald-500/20 text-emerald-200"
                  : "bg-slate-800 text-slate-300"
              }
            >
              {rule.status}
            </Badge>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <p>Last run {rule.lastRunAt ? new Date(rule.lastRunAt).toLocaleString() : "—"}</p>
            <p>{rule.hitCount} hits</p>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={testing === rule.id}
              className="border-cyan-500/40 text-xs text-cyan-200 hover:bg-cyan-500/10"
              onClick={async () => {
                setTesting(rule.id);
                await new Promise(resolve => setTimeout(resolve, 600));
                setTesting(null);
              }}
            >
              {testing === rule.id ? "Testing…" : "Dry-run last 30d"}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-white">
              View logic
            </Button>
          </div>
        </div>
      ))}
      {rules.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800/80 p-6 text-center text-sm text-slate-400">
          No automations attached yet.
        </div>
      )}
    </div>
  );
}

