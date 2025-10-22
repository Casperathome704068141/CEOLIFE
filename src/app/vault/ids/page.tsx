import { PageHeader, PagePrimaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ids = [
  { name: "Passport", owner: "Beno", expires: "Sep 2028" },
  { name: "Driver’s License", owner: "Marcus", expires: "Jan 2026" },
  { name: "PR Card", owner: "Luis", expires: "Aug 2027" },
];

export default function VaultIdsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Identity hub"
        description="Expiry countdowns, biometric locks, and renewal checklists."
        actions={<PagePrimaryAction>Renewal checklist</PagePrimaryAction>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ids.map((id) => (
          <Card key={id.name} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">{id.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Owner</span>
                <span>{id.owner}</span>
              </div>
              <div className="flex justify-between">
                <span>Expires</span>
                <span>{id.expires}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
