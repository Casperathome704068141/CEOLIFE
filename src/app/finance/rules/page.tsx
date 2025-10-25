
"use client";

import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useUser } from "@/firebase";
import { AutomationDoc } from "@/lib/schemas";


export default function RulesPage() {
  const { user } = useUser();
  const { data: rules, loading } = useCollection<AutomationDoc>('automations', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Automation rules"
        description="Visual builder to codify Beno's intelligence."
        actions={
          <>
            <PagePrimaryAction>New rule</PagePrimaryAction>
            <PageSecondaryAction>Test rule</PageSecondaryAction>
          </>
        }
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Active rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? <p className="text-slate-400">Loading rules...</p> : (
            rules?.map((rule) => (
              <div key={rule.id} className="rounded-2xl border border-slate-900/60 bg-slate-900/60 p-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{rule.id}</p>
                    <p className="text-xs text-slate-400">Trigger: {rule.trigger.type}</p>
                  </div>
                  <Button size="sm" variant="secondary" className="rounded-2xl">
                    Configure
                  </Button>
                </div>
                <p className="mt-2 text-xs text-slate-400">Actions: {rule.actions.map(a => a.type).join(', ')}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
