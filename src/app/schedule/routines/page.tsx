
"use client";

import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useUser } from "@/firebase";
import { AutomationDoc } from "@/lib/schemas";

export default function RoutinesPage() {
  const { user } = useUser();
  const { data: automations, loading } = useCollection<AutomationDoc>('automations', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });

  const routines = automations?.filter(a => a.trigger.type === 'cron');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Routines"
        description="Reusable playbooks combining tasks, automations, and analytics."
        actions={
          <>
            <PagePrimaryAction>New routine</PagePrimaryAction>
            <PageSecondaryAction>Simulate impact</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <p className="text-slate-400">Loading routines...</p> : (
          routines?.map((routine) => (
            <Card key={routine.id} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">{routine.id}</CardTitle>
                <p className="text-xs text-slate-400">{routine.actions.length} steps</p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <Button size="sm" className="w-full rounded-2xl" variant="secondary">
                  Run now
                </Button>
                <Button size="sm" className="w-full rounded-2xl" variant="outline">
                  Attach automation
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
