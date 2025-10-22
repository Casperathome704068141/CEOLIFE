import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const columns = [
  { name: "Today", count: 3 },
  { name: "This Week", count: 5 },
  { name: "Later", count: 4 },
  { name: "Done", count: 12 },
];

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Taskboard"
        description="Kanban for routines, automations, and ad hoc tasks."
        actions={
          <>
            <PagePrimaryAction>New task</PagePrimaryAction>
            <PageSecondaryAction>Promote to event</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <Card key={column.name} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">{column.name}</CardTitle>
              <p className="text-xs text-slate-400">{column.count} cards</p>
            </CardHeader>
            <CardContent className="h-64 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center text-sm text-slate-500">
              Drag-and-drop column placeholder
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
