import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const calendarViews = ["Day", "Week", "Month"];

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Calendar sync"
        description="Unified timeline across Beno routines, Google events, and automation reminders."
        actions={
          <>
            <PagePrimaryAction>Sync Google</PagePrimaryAction>
            <PageSecondaryAction>Smart add (NLP)</PageSecondaryAction>
          </>
        }
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">Views</CardTitle>
          <div className="flex gap-2">
            {calendarViews.map((view) => (
              <Button key={view} size="sm" variant="secondary" className="rounded-2xl">
                {view}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="h-[400px] rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center text-sm text-slate-500">
          Timeline placeholder for interactive calendar.
        </CardContent>
      </Card>
    </div>
  );
}
