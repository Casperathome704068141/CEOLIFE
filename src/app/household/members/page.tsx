import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const members = [
  { name: "Beno", role: "Admin", nextBill: "$820 credit card", goals: 3 },
  { name: "Marcus", role: "Family", nextBill: "$220 utilities", goals: 2 },
  { name: "Luis", role: "Family", nextBill: "$150 groceries", goals: 1 },
];

export default function MembersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Household members"
        description="Role-based summaries with quick nudges and permissions."
        actions={
          <>
            <PagePrimaryAction>Add member</PagePrimaryAction>
            <PageSecondaryAction>Assign role</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <Card key={member.name} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">{member.name}</CardTitle>
              <p className="text-xs text-slate-400">{member.role}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Next bill</p>
                <p>{member.nextBill}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Goals</p>
                <p>{member.goals}</p>
              </div>
              <Button size="sm" className="w-full rounded-2xl" variant="secondary">
                Nudge
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
