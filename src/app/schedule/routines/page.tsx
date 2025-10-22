import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const routines = [
  { name: "Morning systems check", steps: 5 },
  { name: "Payday routine", steps: 7 },
  { name: "Monthly audit", steps: 9 },
];

export default function RoutinesPage() {
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
        {routines.map((routine) => (
          <Card key={routine.name} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">{routine.name}</CardTitle>
              <p className="text-xs text-slate-400">{routine.steps} steps</p>
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
        ))}
      </div>
    </div>
  );
}
