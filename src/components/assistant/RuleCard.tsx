"use client";

import { Toggle } from "@/components/ui/toggle";
import type { RuleSpec, RuleTestResult, Action } from "@/lib/assistant/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RuleCard({
  rule,
  testResult,
  onAction,
}: {
  rule: RuleSpec;
  testResult?: RuleTestResult;
  onAction?: (action: Action) => void;
}) {
  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm text-slate-100">{rule.name}</CardTitle>
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-200">
          Rule enabled
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 rounded-2xl border border-slate-800/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Trigger</p>
          <p className="text-sm text-slate-200">{rule.trigger}</p>
        </div>
        {rule.filters && (
          <div className="space-y-2 rounded-2xl border border-slate-800/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Filters</p>
            <div className="flex flex-wrap gap-2">
              {rule.filters.map((filter) => (
                <Badge key={filter} variant="outline" className="border-slate-700/60 text-slate-300">
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2 rounded-2xl border border-slate-800/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Actions</p>
          <ul className="list-disc space-y-1 pl-4 text-sm text-slate-200">
            {rule.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
        {testResult && (
          <div className="space-y-2 rounded-2xl border border-slate-800/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-400">Dry run</p>
              <Badge variant="secondary" className="bg-slate-800 text-slate-200">
                {testResult.matches} matches
              </Badge>
            </div>
            <ul className="space-y-1 text-xs text-slate-300">
              {testResult.preview.map((item) => (
                <li key={item.id}>• {item.summary}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Toggle pressed={rule.enabled} className="text-xs text-emerald-200">
            {rule.enabled ? "Enabled" : "Disabled"}
          </Toggle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                onAction?.({
                  id: `${rule.id}-test`,
                  label: "Test",
                  type: "simulate",
                  payload: { ruleId: rule.id },
                })
              }
            >
              Test
            </Button>
            <Button
              size="sm"
              onClick={() =>
                onAction?.({
                  id: `${rule.id}-toggle`,
                  label: rule.enabled ? "Disable" : "Enable",
                  type: "accept",
                  payload: { ruleId: rule.id, enabled: !rule.enabled },
                })
              }
            >
              {rule.enabled ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
