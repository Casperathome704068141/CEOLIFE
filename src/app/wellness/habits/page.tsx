import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const habits = [
  { name: "Hydration", streak: 8 },
  { name: "Sleep before 11", streak: 5 },
  { name: "Meditation", streak: 12 },
];

export default function HabitsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Habits"
        description="Streaks, reminders, and Beno nudges."
        actions={
          <>
            <PagePrimaryAction>New habit</PagePrimaryAction>
            <PageSecondaryAction>Pause streak</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {habits.map((habit) => (
          <Card key={habit.name} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">{habit.name}</CardTitle>
              <p className="text-xs text-slate-400">Streak {habit.streak} days</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <Button size="sm" className="w-full rounded-2xl" variant="secondary">
                Skip day
              </Button>
              <Button size="sm" className="w-full rounded-2xl" variant="outline">
                Pause
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
