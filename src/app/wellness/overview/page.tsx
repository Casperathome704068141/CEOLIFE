import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const wellnessHighlights = [
  { title: "Mood", value: "7/10", detail: "Balanced" },
  { title: "Sleep", value: "6.5h", detail: "+30 min vs target" },
  { title: "Activity", value: "9k steps", detail: "Goal met" },
];

export default function WellnessOverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Wellness telemetry"
        description="Mood, sleep, and activity correlation against spend categories."
        actions={
          <>
            <PagePrimaryAction>Log now</PagePrimaryAction>
            <PageSecondaryAction>Connect health</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {wellnessHighlights.map((highlight) => (
          <Card key={highlight.title} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">{highlight.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-300">
              <p className="text-2xl font-semibold text-cyan-200">{highlight.value}</p>
              <p className="text-xs text-slate-400">{highlight.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Correlation</CardTitle>
          <p className="text-xs text-slate-400">Spend vs wellness toggle placeholder.</p>
        </CardHeader>
        <CardContent className="h-48 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center text-sm text-slate-500">
          Graph placeholder
        </CardContent>
      </Card>
    </div>
  );
}
