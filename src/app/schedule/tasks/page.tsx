
"use client";

import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useUser } from "@/firebase";
import { EventDoc } from "@/lib/schemas";

type Column = 'Today' | 'This Week' | 'Later' | 'Done';

const columns: Column[] = [
  "Today",
  "This Week",
  "Later",
  "Done",
];

function getColumnForEvent(event: EventDoc): Column {
  const now = new Date();
  const eventDate = (event.start as any)?.toDate();
  if (!eventDate) return "Later";

  const diffDays = (eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24);

  if (diffDays < 0) return "Done";
  if (diffDays < 1) return "Today";
  if (diffDays < 7) return "This Week";
  return "Later";
}


export default function TasksPage() {
  const { user } = useUser();
  const { data: events, loading } = useCollection<EventDoc>('events', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });

  const tasksByColumn = columns.reduce((acc, col) => {
    acc[col] = [];
    return acc;
  }, {} as Record<Column, EventDoc[]>);

  events?.forEach(event => {
    const column = getColumnForEvent(event);
    tasksByColumn[column].push(event);
  });

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
          <Card key={column} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">{column}</CardTitle>
              <p className="text-xs text-slate-400">{tasksByColumn[column].length} cards</p>
            </CardHeader>
            <CardContent className="h-64 space-y-2 overflow-y-auto rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-2 text-sm text-slate-500">
              {tasksByColumn[column].map(task => (
                <div key={task.id} className="rounded-lg bg-slate-900 p-2 text-white">
                  {task.title}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
